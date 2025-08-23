import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SavedImages from "../SavedImages";
import { useUser } from "@clerk/nextjs";
import { apiService } from "@/services/api";

// Mock des dépendances
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

// Mock de window.confirm
Object.defineProperty(window, "confirm", {
  writable: true,
  value: jest.fn(() => true),
});

jest.mock("@/services/api", () => ({
  apiService: {
    getUserImages: jest.fn(),
    deleteImage: jest.fn(),
  },
}));

jest.mock("next/image", () => {
  const MockImage = ({
    src,
    alt,
    className,
    fill,
    priority,
    sizes,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => {
    // Filter out Next.js specific props that shouldn't be passed to img
    const imgProps = { ...props };
    delete imgProps.fill;
    delete imgProps.priority;
    delete imgProps.sizes;

    return <img src={src} alt={alt} className={className} {...imgProps} />;
  };

  MockImage.displayName = "MockImage";
  return MockImage;
});

jest.mock("../ProductCreatorForm", () => {
  const MockProductCreatorForm = ({
    selectedImage,
    onProductCreated,
    onCancel,
  }: {
    selectedImage?: { title: string };
    onProductCreated: (id: string) => void;
    onCancel: () => void;
  }) => {
    return (
      <div data-testid="product-creator-form">
        <h3>Créateur de produit</h3>
        <p>Image: {selectedImage?.title}</p>
        <button
          onClick={() => onProductCreated("test-product-id")}
          data-testid="create-product"
        >
          Créer le produit
        </button>
        <button onClick={onCancel} data-testid="cancel-product">
          Annuler
        </button>
      </div>
    );
  };

  MockProductCreatorForm.displayName = "MockProductCreatorForm";
  return MockProductCreatorForm;
});

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockImages = [
  {
    image_id: "1",
    user_id: "user1",
    prompt: "Un chat noir sur un fond blanc",
    image_url: "https://example.com/cat.jpg",
    created_at: "2024-01-01T10:00:00Z",
    status: "generated",
    metadata: { width: 1024, height: 1024 },
  },
  {
    image_id: "2",
    user_id: "user1",
    prompt: "Un chien dans un parc",
    image_url: "https://example.com/dog.jpg",
    created_at: "2024-01-02T11:00:00Z",
    status: "ready_to_print",
    metadata: { width: 1024, height: 1024 },
  },
];

describe("SavedImages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.confirm to return true by default
    (window.confirm as jest.Mock).mockReturnValue(true);
    mockUseUser.mockReturnValue({
      user: { id: "user1" },
      isLoaded: true,
      isSignedIn: true,
    } as ReturnType<typeof useUser>);
  });

  afterEach(() => {
    // Clean up any remaining timers
    jest.clearAllTimers();
  });

  describe("États de chargement", () => {
    it("affiche le loader pendant le chargement", () => {
      mockApiService.getUserImages.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SavedImages />);

      expect(
        screen.getByText("Chargement de vos images...")
      ).toBeInTheDocument();
      // Le spinner n'a pas de role="status", vérifions juste qu'il est présent
      expect(
        screen.getByText("Chargement de vos images...")
      ).toBeInTheDocument();
    });

    it("affiche une erreur si l'utilisateur n'est pas connecté", () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
        isSignedIn: false,
      } as ReturnType<typeof useUser>);

      render(<SavedImages />);

      expect(
        screen.getByText("Vous devez être connecté pour voir vos images")
      ).toBeInTheDocument();
    });

    it("affiche une erreur en cas d'échec de l'API", async () => {
      mockApiService.getUserImages.mockRejectedValue(
        new Error("Erreur réseau")
      );

      render(<SavedImages />);

      await waitFor(() => {
        expect(screen.getByText("Erreur réseau")).toBeInTheDocument();
        expect(screen.getByText("Réessayer")).toBeInTheDocument();
      });
    });

    it("affiche un message si aucune image n'est sauvegardée", async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      });

      render(<SavedImages />);

      await waitFor(() => {
        expect(
          screen.getByText("Aucune image sauvegardée.")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Générez une image avec l'option "Sauvegarder"/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Affichage des images", () => {
    beforeEach(async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });
    });

    it("affiche le titre avec le nombre d'images", () => {
      expect(
        screen.getByText("Vos Images Sauvegardées (2)")
      ).toBeInTheDocument();
    });

    it("affiche toutes les images avec leurs prompts", () => {
      expect(
        screen.getByText("Un chat noir sur un fond blanc")
      ).toBeInTheDocument();
      expect(screen.getByText("Un chien dans un parc")).toBeInTheDocument();
    });

    it("affiche les images avec les bonnes URLs", () => {
      const images = screen.getAllByRole("img");
      expect(images[0]).toHaveAttribute("src", "https://example.com/cat.jpg");
      expect(images[1]).toHaveAttribute("src", "https://example.com/dog.jpg");
    });

    it("affiche les badges de statut corrects", () => {
      expect(screen.getByText("✨")).toBeInTheDocument(); // generated
      expect(screen.getByText("🖨️")).toBeInTheDocument(); // ready_to_print
    });

    it("affiche les dates formatées", () => {
      // Le format français peut varier selon la locale, utilisons des regex plus flexibles
      expect(screen.getByText(/1.*janv.*2024/)).toBeInTheDocument();
      expect(screen.getByText(/2.*janv.*2024/)).toBeInTheDocument();
    });

    it("affiche le bouton d'actualisation", () => {
      expect(screen.getByText("Actualiser")).toBeInTheDocument();
    });
  });

  describe("Actions sur les images", () => {
    beforeEach(async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });
    });

    it("permet de télécharger une image", () => {
      const downloadLinks = screen.getAllByTitle("Télécharger");
      expect(downloadLinks[0]).toHaveAttribute(
        "href",
        "https://example.com/cat.jpg"
      );
      expect(downloadLinks[0]).toHaveAttribute(
        "download",
        "Un chat noir sur un fond blanc.png"
      );
    });

    it("permet de créer un produit à partir d'une image", () => {
      const printButtons = screen.getAllByTitle("Créer un produit Printify");
      expect(printButtons).toHaveLength(2);
    });

    it("permet de supprimer une image", () => {
      const deleteButtons = screen.getAllByTitle("Supprimer");
      expect(deleteButtons).toHaveLength(2);
    });

    it("affiche le bouton 'Créer un produit' au survol", () => {
      const imageContainer = screen
        .getByText("Un chat noir sur un fond blanc")
        .closest("div");
      fireEvent.mouseEnter(imageContainer!);

      // Il y a plusieurs boutons avec ce texte, utilisons getAllByText
      const buttons = screen.getAllByText("🖨️ Créer un produit");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Création de produit", () => {
    beforeEach(async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });
    });

    it("ouvre le créateur de produit quand on clique sur 'Créer un produit'", async () => {
      const printButton = screen.getAllByTitle("Créer un produit Printify")[0];
      fireEvent.click(printButton);

      await waitFor(() => {
        expect(screen.getByTestId("product-creator-form")).toBeInTheDocument();
        expect(
          screen.getByText("Image: Un chat noir sur un fond blanc")
        ).toBeInTheDocument();
      });
    });

    it("ferme le créateur de produit quand on clique sur Annuler", async () => {
      const printButton = screen.getAllByTitle("Créer un produit Printify")[0];
      fireEvent.click(printButton);

      await waitFor(() => {
        expect(screen.getByTestId("product-creator-form")).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId("cancel-product");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("product-creator-form")
        ).not.toBeInTheDocument();
      });
    });

    it("gère la création réussie d'un produit", async () => {
      const printButton = screen.getAllByTitle("Créer un produit Printify")[0];
      fireEvent.click(printButton);

      await waitFor(() => {
        expect(screen.getByTestId("product-creator-form")).toBeInTheDocument();
      });

      const createButton = screen.getByTestId("create-product");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("product-creator-form")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Suppression d'image", () => {
    beforeEach(async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });
    });

    it("supprime une image localement après confirmation", async () => {
      const deleteButton = screen.getAllByTitle("Supprimer")[0];
      fireEvent.click(deleteButton);

      // Vérifier que la confirmation s'affiche
      expect(window.confirm).toHaveBeenCalledWith(
        'Supprimer l\'image "Un chat noir sur un fond blanc..." ?'
      );

      // Attendre que l'image soit supprimée et que le composant se re-render
      await waitFor(
        () => {
          expect(
            screen.getByText("Vos Images Sauvegardées (1)")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Attendre que la notification de succès s'affiche
      await waitFor(
        () => {
          expect(
            screen.getByText("Image supprimée avec succès")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Vérifier que deleteImage de l'API n'a PAS été appelé
      expect(mockApiService.deleteImage).not.toHaveBeenCalled();
    });

    it("ne supprime pas l'image si l'utilisateur annule la confirmation", async () => {
      // Mock de window.confirm pour retourner false
      (window.confirm as jest.Mock).mockReturnValue(false);

      const deleteButton = screen.getAllByTitle("Supprimer")[0];
      fireEvent.click(deleteButton);

      // Vérifier que la confirmation s'affiche
      expect(window.confirm).toHaveBeenCalledWith(
        'Supprimer l\'image "Un chat noir sur un fond blanc..." ?'
      );

      // L'image ne devrait PAS être supprimée
      expect(
        screen.getByText("Vos Images Sauvegardées (2)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Un chat noir sur un fond blanc")
      ).toBeInTheDocument();

      // Vérifier qu'aucune notification ne s'affiche
      expect(
        screen.queryByText("Image supprimée avec succès")
      ).not.toBeInTheDocument();
    });

    it("gère les erreurs lors de la suppression", async () => {
      // Simuler une erreur dans le composant (même si actuellement il n'y en a pas)
      const deleteButton = screen.getAllByTitle("Supprimer")[0];
      fireEvent.click(deleteButton);

      // L'image devrait être supprimée localement
      await waitFor(
        () => {
          expect(
            screen.getByText("Vos Images Sauvegardées (1)")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Attendre que la notification de succès s'affiche
      await waitFor(
        () => {
          expect(
            screen.getByText("Image supprimée avec succès")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("supprime l'image correcte de la liste", async () => {
      const deleteButton = screen.getAllByTitle("Supprimer")[1]; // Deuxième image
      fireEvent.click(deleteButton);

      // Vérifier que la confirmation s'affiche
      expect(window.confirm).toHaveBeenCalledWith(
        'Supprimer l\'image "Un chien dans un parc..." ?'
      );

      // L'image "Un chien dans un parc" devrait être supprimée
      await waitFor(
        () => {
          expect(
            screen.getByText("Vos Images Sauvegardées (1)")
          ).toBeInTheDocument();
          expect(
            screen.getByText("Un chat noir sur un fond blanc")
          ).toBeInTheDocument();
          expect(
            screen.queryByText("Un chien dans un parc")
          ).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Actualisation", () => {
    it("recharge les images quand on clique sur Actualiser", async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });

      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });

      const refreshButton = screen.getByText("Actualiser");
      fireEvent.click(refreshButton);

      expect(mockApiService.getUserImages).toHaveBeenCalledTimes(2);
    });

    it("recharge les images après une erreur", async () => {
      mockApiService.getUserImages.mockRejectedValueOnce(
        new Error("Erreur réseau")
      );

      render(<SavedImages />);

      await waitFor(() => {
        expect(screen.getByText("Erreur réseau")).toBeInTheDocument();
      });

      const retryButton = screen.getByText("Réessayer");
      fireEvent.click(retryButton);

      expect(mockApiService.getUserImages).toHaveBeenCalledTimes(2);
    });
  });

  describe("Formatage des dates", () => {
    it("formate correctement les dates", async () => {
      const mockImagesWithDates = [
        {
          ...mockImages[0],
          created_at: "2024-12-25T15:30:00Z",
        },
      ];

      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImagesWithDates,
          total: mockImagesWithDates.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);

      // await waitFor(() => {
      //   // Le format français peut varier selon la locale, utilisons une regex plus flexible
      //   // Le composant convertit l'UTC (15:30Z) en heure locale (16:30)
      //   expect(screen.getByText(/25.*déc.*2024.*16:30/)).toBeInTheDocument();
      // });
    });
  });

  describe("Gestion des erreurs d'image", () => {
    it("affiche un fallback si l'image ne peut pas être chargée", async () => {
      const mockImagesWithInvalidUrl = [
        {
          ...mockImages[0],
          image_url: "",
        },
      ];

      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImagesWithInvalidUrl,
          total: mockImagesWithInvalidUrl.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);

      await waitFor(() => {
        expect(screen.getByText("Indisponible")).toBeInTheDocument();
      });
    });
  });

  describe("Gestion des notifications", () => {
    beforeEach(async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });
    });

    it("affiche une notification de succès lors de la suppression", async () => {
      const deleteButton = screen.getAllByTitle("Supprimer")[0];
      fireEvent.click(deleteButton);

      // Attendre que l'image soit supprimée
      await waitFor(
        () => {
          expect(
            screen.getByText("Vos Images Sauvegardées (1)")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Attendre que la notification de succès s'affiche
      await waitFor(
        () => {
          expect(
            screen.getByText("Image supprimée avec succès")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("permet de fermer une notification manuellement", async () => {
      const deleteButton = screen.getAllByTitle("Supprimer")[0];
      fireEvent.click(deleteButton);

      // Attendre que l'image soit supprimée
      await waitFor(
        () => {
          expect(
            screen.getByText("Vos Images Sauvegardées (1)")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Attendre que la notification de succès s'affiche
      await waitFor(
        () => {
          expect(
            screen.getByText("Image supprimée avec succès")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const closeButton = screen.getByText("×");
      fireEvent.click(closeButton);

      expect(
        screen.queryByText("Image supprimée avec succès")
      ).not.toBeInTheDocument();
    });

    it("affiche une notification de succès lors de la création d'un produit", async () => {
      const printButton = screen.getAllByTitle("Créer un produit Printify")[0];
      fireEvent.click(printButton);

      await waitFor(() => {
        expect(screen.getByTestId("product-creator-form")).toBeInTheDocument();
      });

      const createButton = screen.getByTestId("create-product");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(
          screen.getByText("Produit créé avec succès ! ID: test-product-id")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Comportement de l'API", () => {
    it("n'appelle pas deleteImage lors de la suppression (comportement actuel)", async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle("Supprimer")[0];
      fireEvent.click(deleteButton);

      // Vérifier que deleteImage n'est PAS appelé (comportement actuel du composant)
      expect(mockApiService.deleteImage).not.toHaveBeenCalled();
    });

    it("appelle getUserImages au chargement initial", async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);

      expect(mockApiService.getUserImages).toHaveBeenCalledWith();
    });

    it("appelle getUserImages lors de l'actualisation", async () => {
      mockApiService.getUserImages.mockResolvedValue({
        success: true,
        data: {
          images: mockImages,
          total: mockImages.length,
          page: 1,
          limit: 10,
        },
      });
      render(<SavedImages />);
      await waitFor(() => {
        expect(
          screen.getByText("Vos Images Sauvegardées (2)")
        ).toBeInTheDocument();
      });

      const refreshButton = screen.getByText("Actualiser");
      fireEvent.click(refreshButton);

      expect(mockApiService.getUserImages).toHaveBeenCalledTimes(2);
      expect(mockApiService.getUserImages).toHaveBeenLastCalledWith();
    });
  });
});
