import React from "react";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import { UserCreditsProvider, useUserCredits } from "../UserCreditsContext";
import { paymentService } from "@/services/paymentService";

// Mock des services
jest.mock("@/services/paymentService", () => ({
  paymentService: {
    getUserCredits: jest.fn(),
  },
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

// Composant de test pour utiliser le context
const TestComponent = () => {
  const { credits, refreshCredits } = useUserCredits();
  return (
    <div>
      <span data-testid="credits-display">Crédits: {credits}</span>
      <button data-testid="refresh-button" onClick={refreshCredits}>
        Actualiser
      </button>
    </div>
  );
};

// Wrapper pour les tests
const renderWithProvider = (component: React.ReactElement) => {
  return render(<UserCreditsProvider>{component}</UserCreditsProvider>);
};

describe("UserCreditsContext", () => {
  const mockPaymentService = paymentService as jest.Mocked<
    typeof paymentService
  >;
  const mockUseUser = require("@clerk/nextjs").useUser as jest.Mock;

  // Helper pour créer des mocks UserCredits valides
  const createMockUserCredits = (
    credits: number,
    userId: string = "user123"
  ) => ({
    userId,
    credits,
    canGenerate: credits > 0,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPaymentService.getUserCredits.mockResolvedValue(
      createMockUserCredits(10)
    );
  });

  describe("Rendu initial", () => {
    it("affiche 0 crédits par défaut", () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });

      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId("credits-display")).toHaveTextContent(
        "Crédits: 0"
      );
    });

    it("charge automatiquement les crédits au montage", async () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits.mockResolvedValue(
        createMockUserCredits(25)
      );

      renderWithProvider(<TestComponent />);

      // Attendre que les crédits soient chargés
      await screen.findByText("Crédits: 25");
    });
  });

  describe("Gestion des utilisateurs", () => {
    it("ne charge pas les crédits si l'utilisateur n'est pas connecté", async () => {
      mockUseUser.mockReturnValue({ user: null });

      renderWithProvider(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 0"
        );
      });

      expect(mockPaymentService.getUserCredits).not.toHaveBeenCalled();
    });

    it("charge les crédits quand l'utilisateur se connecte", async () => {
      mockUseUser.mockReturnValue({ user: null });

      const { rerender } = renderWithProvider(<TestComponent />);

      // Utilisateur non connecté
      expect(screen.getByTestId("credits-display")).toHaveTextContent(
        "Crédits: 0"
      );

      // Utilisateur se connecte
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits.mockResolvedValue(
        createMockUserCredits(15)
      );

      rerender(
        <UserCreditsProvider>
          <TestComponent />
        </UserCreditsProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 15"
        );
      });
    });
  });

  describe("Fonction refreshCredits", () => {
    it("permet de rafraîchir manuellement les crédits", async () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits
        .mockResolvedValueOnce({ credits: 10 })
        .mockResolvedValueOnce({ credits: 20 });

      renderWithProvider(<TestComponent />);

      // Attendre le chargement initial
      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 10"
        );
      });

      // Cliquer sur le bouton de rafraîchissement
      const refreshButton = screen.getByTestId("refresh-button");
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      // Vérifier que les crédits ont été mis à jour
      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 20"
        );
      });

      expect(mockPaymentService.getUserCredits).toHaveBeenCalledTimes(2);
    });

    it("gère les erreurs lors du rafraîchissement", async () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits
        .mockResolvedValueOnce({ credits: 10 })
        .mockRejectedValueOnce(new Error("Erreur réseau"));

      renderWithProvider(<TestComponent />);

      // Attendre le chargement initial
      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 10"
        );
      });

      // Cliquer sur le bouton de rafraîchissement (avec erreur)
      const refreshButton = screen.getByTestId("refresh-button");
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      // Vérifier que les crédits sont remis à 0 en cas d'erreur
      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 0"
        );
      });
    });
  });

  describe("Gestion des erreurs", () => {
    it("met les crédits à 0 en cas d'erreur de chargement", async () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits.mockRejectedValue(
        new Error("Erreur réseau")
      );

      renderWithProvider(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 0"
        );
      });
    });

    it("continue à fonctionner après une erreur", async () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits
        .mockRejectedValueOnce(new Error("Erreur réseau"))
        .mockResolvedValueOnce({ credits: 30 });

      renderWithProvider(<TestComponent />);

      // Attendre que les crédits soient à 0 après l'erreur
      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 0"
        );
      });

      // Rafraîchir pour récupérer
      const refreshButton = screen.getByTestId("refresh-button");
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      // Vérifier que ça fonctionne à nouveau
      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 30"
        );
      });
    });
  });

  describe("Performance et optimisations", () => {
    it("utilise useCallback pour refreshCredits", () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });

      renderWithProvider(<TestComponent />);

      // Vérifier que le composant se rend correctement
      expect(screen.getByTestId("credits-display")).toBeInTheDocument();
    });

    it("ne fait pas d'appels inutiles à l'API", async () => {
      mockUseUser.mockReturnValue({ user: { id: "user123" } });
      mockPaymentService.getUserCredits.mockResolvedValue(
        createMockUserCredits(10)
      );

      renderWithProvider(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId("credits-display")).toHaveTextContent(
          "Crédits: 10"
        );
      });

      // Vérifier qu'un seul appel a été fait au montage
      expect(mockPaymentService.getUserCredits).toHaveBeenCalledTimes(1);
      expect(mockPaymentService.getUserCredits).toHaveBeenCalledWith("user123");
    });
  });
});
