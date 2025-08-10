import React from "react";
import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";
import { useUserCredits } from "@/context/UserCreditsContext";
import Header from "../Header";

// Types pour les mocks
type MockUseUserReturn = {
  user: { id: string; emailAddresses: { emailAddress: string }[] } | null;
  isLoaded: boolean;
  isSignedIn: boolean;
};

// Mock des hooks externes
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  // eslint-disable-next-line react/display-name
  UserButton: ({ children, ...props }: React.ComponentProps<"div">) => {
    // Filtrer les props problématiques qui causent des erreurs de console
    const safeProps = { ...props };
    delete (safeProps as Record<string, unknown>).appearance;
    delete (safeProps as Record<string, unknown>).userProfileMode;
    delete (safeProps as Record<string, unknown>).afterSignOutUrl;
    delete (safeProps as Record<string, unknown>).jsx;
    delete (safeProps as Record<string, unknown>).global;

    return (
      <div data-testid="user-button" {...safeProps}>
        {children}
      </div>
    );
  },
}));

jest.mock("@/context/UserCreditsContext", () => ({
  useUserCredits: jest.fn(),
}));

// Mock de Next.js Link
jest.mock("next/link", () => {
  return ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

const mockUseUser = useUser as jest.MockedFunction<() => MockUseUserReturn>;
const mockUseUserCredits = useUserCredits as jest.MockedFunction<
  typeof useUserCredits
>;

describe("Header", () => {
  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("affiche le logo Imagink", () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUserCredits.mockReturnValue({
        credits: 0,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      expect(screen.getByText("Imagink")).toBeInTheDocument();
    });

    it("affiche le lien vers la page d'accueil", () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUserCredits.mockReturnValue({
        credits: 0,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      const logoLink = screen.getByText("Imagink").closest("a");
      expect(logoLink).toHaveAttribute("href", "/");
    });
  });

  describe("Navigation pour utilisateurs non connectés", () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUserCredits.mockReturnValue({
        credits: 0,
        refreshCredits: jest.fn(),
      });
    });

    it("affiche le lien Fonctionnalités", () => {
      render(<Header />);

      expect(screen.getByText("Fonctionnalités")).toBeInTheDocument();
      expect(screen.getByText("Fonctionnalités")).toHaveAttribute(
        "href",
        "/features"
      );
    });

    it("affiche le lien Tarifs", () => {
      render(<Header />);

      expect(screen.getByText("Tarifs")).toBeInTheDocument();
      expect(screen.getByText("Tarifs")).toHaveAttribute("href", "/pricing");
    });

    it("affiche le bouton de connexion (desktop)", () => {
      render(<Header />);

      const desktopButton = screen.getByTestId("signin-button-desktop");
      expect(desktopButton).toBeInTheDocument();
      expect(desktopButton).toHaveAttribute("href", "/sign-in");
      expect(desktopButton).toHaveClass("hidden", "sm:block");
    });

    it("affiche le bouton d'inscription", () => {
      render(<Header />);

      expect(screen.getByText("Commencer")).toBeInTheDocument();
      expect(screen.getByText("Commencer")).toHaveAttribute("href", "/sign-up");
    });

    it("affiche le bouton de connexion mobile avec style spécial", () => {
      render(<Header />);

      const mobileSignInButton = screen.getByTestId("signin-button-mobile");
      expect(mobileSignInButton).toBeInTheDocument();
      expect(mobileSignInButton).toHaveAttribute("href", "/sign-in");
      expect(mobileSignInButton).toHaveClass("sm:hidden", "bg-gradient-to-r");
    });
  });

  describe("Navigation pour utilisateurs connectés", () => {
    const mockUser = {
      id: "user123",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    };

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
        isSignedIn: true,
      });
    });

    it("affiche le lien Galerie", () => {
      mockUseUserCredits.mockReturnValue({
        credits: 10,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      expect(screen.getByText("Galerie")).toBeInTheDocument();
      expect(screen.getByText("Galerie")).toHaveAttribute("href", "/gallery");
    });

    it("affiche le lien Tarifs", () => {
      mockUseUserCredits.mockReturnValue({
        credits: 10,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      expect(screen.getByText("Tarifs")).toBeInTheDocument();
      expect(screen.getByText("Tarifs")).toHaveAttribute("href", "/pricing");
    });

    it("n'affiche PAS les liens Fonctionnalités et Commencer", () => {
      mockUseUserCredits.mockReturnValue({
        credits: 10,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      expect(screen.queryByText("Fonctionnalités")).not.toBeInTheDocument();
      expect(screen.queryByText("Commencer")).not.toBeInTheDocument();
    });
  });

  describe("Affichage des crédits", () => {
    const mockUser = {
      id: "user123",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    };

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
        isSignedIn: true,
      });
    });

    it("affiche les crédits avec indicateur vert quand > 0", () => {
      mockUseUserCredits.mockReturnValue({
        credits: 15,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      expect(screen.getByText("15 crédits")).toBeInTheDocument();

      // Vérifier l'indicateur vert
      const indicator = screen.getByText("15 crédits").previousElementSibling;
      expect(indicator).toHaveClass("bg-green-500");
    });

    it("affiche les crédits avec indicateur rouge quand = 0", () => {
      mockUseUserCredits.mockReturnValue({
        credits: 0,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      expect(screen.getByText("0 crédits")).toBeInTheDocument();

      // Vérifier l'indicateur rouge
      const indicator = screen.getByText("0 crédits").previousElementSibling;
      expect(indicator).toHaveClass("bg-red-500");
    });

    it("n'affiche pas les crédits sur mobile (classe hidden sm:flex)", () => {
      mockUseUserCredits.mockReturnValue({
        credits: 10,
        refreshCredits: jest.fn(),
      });

      render(<Header />);

      const creditsContainer = screen.getByText("10 crédits").closest("div");
      expect(creditsContainer).toHaveClass("hidden", "sm:flex");
    });
  });

  describe("UserButton", () => {
    const mockUser = {
      id: "user123",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    };

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
        isSignedIn: true,
      });
      mockUseUserCredits.mockReturnValue({
        credits: 10,
        refreshCredits: jest.fn(),
      });
    });

    it("affiche le UserButton pour les utilisateurs connectés", () => {
      render(<Header />);

      expect(screen.getByTestId("user-button")).toBeInTheDocument();
    });

    it("n'affiche pas le UserButton pour les utilisateurs non connectés", () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });

      render(<Header />);

      expect(screen.queryByTestId("user-button")).not.toBeInTheDocument();
    });
  });

  describe("Responsive design", () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUserCredits.mockReturnValue({
        credits: 0,
        refreshCredits: jest.fn(),
      });
    });

    it("cache la navigation desktop sur mobile (classe hidden md:flex)", () => {
      render(<Header />);

      const nav = screen.getByText("Fonctionnalités").closest("nav");
      expect(nav).toHaveClass("hidden", "md:flex");
    });

    it("affiche le bouton de connexion mobile sur mobile (classe sm:hidden)", () => {
      render(<Header />);

      const mobileButton = screen.getByTestId("signin-button-mobile");
      expect(mobileButton).toHaveClass("sm:hidden");
    });

    it("cache le bouton de connexion desktop sur mobile (classe hidden sm:block)", () => {
      render(<Header />);

      const desktopButton = screen.getByTestId("signin-button-desktop");
      expect(desktopButton).toHaveClass("hidden", "sm:block");
    });
  });

  describe("Styles et classes CSS", () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUserCredits.mockReturnValue({
        credits: 0,
        refreshCredits: jest.fn(),
      });
    });

    it("applique les classes de style correctes au header", () => {
      render(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass(
        "sticky",
        "top-0",
        "z-50",
        "border-b",
        "border-gray-200",
        "backdrop-blur-sm",
        "bg-white/95"
      );
    });

    it("applique le gradient au logo", () => {
      render(<Header />);

      const logo = screen.getByText("Imagink");
      expect(logo).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-500",
        "to-purple-600",
        "bg-clip-text",
        "text-transparent"
      );
    });

    it("applique les styles de transition aux liens", () => {
      render(<Header />);

      const featuresLink = screen.getByText("Fonctionnalités");
      expect(featuresLink).toHaveClass("transition-colors");
    });
  });
});
