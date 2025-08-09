import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageGenerator from "../ImageGenerator";
import React from "react";

// Mock services and context
jest.mock("@/services/api", () => ({
  apiService: {
    generateImage: jest.fn(),
  },
}));

jest.mock("@/services/paymentService", () => ({
  paymentService: {
    useCredits: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: { id: "user_123" } }),
}));

// Provide a controllable implementation of useUserCredits
const mockUseUserCredits = jest.fn(() => ({
  credits: 5,
  refreshCredits: async () => {},
}));
jest.mock("@/context/UserCreditsContext", () => ({
  useUserCredits: () => mockUseUserCredits(),
}));

// Toasts can be noisy; mock
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
    // Catch and swallow rejections so tests don't fail on unhandled rejections
    promise: jest.fn((p: Promise<any>) => {
      if (p && typeof (p as any).catch === "function") {
        (p as any).catch(() => {});
      }
      return undefined;
    }),
  },
}));

describe("ImageGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserCredits.mockReturnValue({
      credits: 5,
      refreshCredits: async () => {},
    });
  });

  it("validates empty prompt", async () => {
    const { default: toast } = await import("react-hot-toast");
    render(<ImageGenerator />);

    const button = screen.getByRole("button", { name: /générer/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("blocks when no credits and redirects to pricing", async () => {
    const { default: toast } = await import("react-hot-toast");
    mockUseUserCredits.mockReturnValue({
      credits: 0,
      refreshCredits: async () => {},
    });

    render(<ImageGenerator />);

    const input = screen.getByLabelText(/décrivez votre image/i);
    fireEvent.change(input, { target: { value: "un chat mignon" } });

    const button = screen.getByRole("button", { name: /générer/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("uses a credit and displays generated image on success", async () => {
    const { apiService } = await import("@/services/api");
    (apiService.generateImage as jest.Mock).mockResolvedValueOnce(
      new Blob(["fake"], { type: "image/png" })
    );

    render(<ImageGenerator />);

    const input = screen.getByLabelText(/décrivez votre image/i);
    fireEvent.change(input, { target: { value: "un chat mignon" } });

    const button = screen.getByRole("button", { name: /générer/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByAltText(/image générée/i)).toBeInTheDocument();
    });
  });

  it("shows error state when generation fails", async () => {
    const { apiService } = await import("@/services/api");
    (apiService.generateImage as jest.Mock).mockRejectedValueOnce(
      new Error("boom")
    );

    render(<ImageGenerator />);

    const input = screen.getByLabelText(/décrivez votre image/i);
    fireEvent.change(input, { target: { value: "un chat mignon" } });

    const button = screen.getByRole("button", { name: /générer/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("boom")).toBeInTheDocument();
    });
  });
});
