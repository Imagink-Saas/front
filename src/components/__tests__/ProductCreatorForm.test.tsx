import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductCreatorForm from "../ProductCreatorForm";
import React from "react";

// Mock des services
jest.mock("@/services/printifyService", () => ({
  printifyService: {
    getBlueprints: jest.fn(),
    getProviders: jest.fn(),
    getVariants: jest.fn(),
    createProduct: jest.fn(),
    groupVariantsByColor: jest.fn(),
  },
}));

// Mock des composants enfants
jest.mock("@/components/ProductFilters", () => ({
  __esModule: true,
  default: ({
    onSearchChange,
    onClearFilters,
  }: {
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
  }) => (
    <div data-testid="product-filters">
      <input
        data-testid="search-input"
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Rechercher..."
      />
      <button data-testid="clear-filters" onClick={onClearFilters}>
        Effacer les filtres
      </button>
    </div>
  ),
  useProductFilters: jest.fn(() => ({
    searchQuery: "",
    selectedBrand: "",
    filteredBlueprints: mockBlueprints,
    hasActiveFilters: false,
    setSearchQuery: jest.fn(),
    setSelectedBrand: jest.fn(),
    clearFilters: jest.fn(),
  })),
}));

// Mock state for pagination
let mockCurrentPage = 1;

jest.mock("@/components/Pagination", () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <button
        data-testid="prev-page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Précédent
      </button>
      <span data-testid="pagination-page-info">
        {currentPage} / {totalPages}
      </span>
      <button
        data-testid="next-page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Suivant
      </button>
    </div>
  ),
  usePagination: jest.fn(() => ({
    get currentPage() {
      return mockCurrentPage;
    },
    totalPages: 2,
    currentItems: mockBlueprints.slice(
      (mockCurrentPage - 1) * 6,
      mockCurrentPage * 6
    ),
    totalItems: mockBlueprints.length,
    goToPage: jest.fn((page: number) => {
      mockCurrentPage = page;
    }),
  })),
}));

// Mock des hooks Clerk
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: { id: "user_123" } }),
}));

// Données de test
const mockSelectedImage = {
  id: "img_123",
  url: "https://example.com/image.jpg",
  title: "Image de test",
  width: 800,
  height: 600,
};

const mockBlueprints = [
  {
    id: 1,
    title: "T-shirt Premium",
    brand: "Brand A",
    model: "Model X",
    description: "T-shirt de haute qualité",
    images: ["https://example.com/tshirt1.jpg"],
  },
  {
    id: 2,
    title: "Mug Personnalisé",
    brand: "Brand B",
    model: "Model Y",
    description: "Mug avec impression personnalisée",
    images: ["https://example.com/mug1.jpg"],
  },
  {
    id: 3,
    title: "Casquette Personnalisée",
    brand: "Brand C",
    model: "Model Z",
    description: "Casquette avec broderie personnalisée",
    images: ["https://example.com/cap1.jpg"],
  },
  {
    id: 4,
    title: "Poster A3",
    brand: "Brand D",
    model: "Model W",
    description: "Poster haute résolution",
    images: ["https://example.com/poster1.jpg"],
  },
  {
    id: 5,
    title: "Stickers Pack",
    brand: "Brand E",
    model: "Model V",
    description: "Pack de stickers personnalisés",
    images: ["https://example.com/stickers1.jpg"],
  },
  {
    id: 6,
    title: "Tote Bag",
    brand: "Brand F",
    model: "Model U",
    description: "Sac en toile personnalisé",
    images: ["https://example.com/bag1.jpg"],
  },
  {
    id: 7,
    title: "Phone Case",
    brand: "Brand G",
    model: "Model T",
    description: "Coque de téléphone personnalisée",
    images: ["https://example.com/case1.jpg"],
  },
];

const mockProviders = [
  {
    id: 1,
    title: "Provider A",
    description: "Fournisseur de qualité",
  },
  {
    id: 2,
    title: "Provider B",
    description: "Fournisseur économique",
  },
];

const mockVariants = [
  {
    id: 1,
    title: "T-shirt S Rouge",
    options: { color: "Rouge", size: "S" },
    costFormatted: "15.00 €",
    color: "Rouge",
    size: "S",
    isAvailable: true,
    displayName: "S",
  },
  {
    id: 2,
    title: "T-shirt M Rouge",
    options: { color: "Rouge", size: "M" },
    costFormatted: "15.00 €",
    color: "Rouge",
    size: "M",
    isAvailable: true,
    displayName: "M",
  },
  {
    id: 3,
    title: "T-shirt L Bleu",
    options: { color: "Bleu", size: "L" },
    costFormatted: "15.00 €",
    color: "Bleu",
    size: "L",
    isAvailable: true,
    displayName: "L",
  },
];

const mockCallbacks = {
  onProductCreated: jest.fn(),
  onCancel: jest.fn(),
};

describe("ProductCreatorForm", () => {
  let mockPrintifyService: {
    getBlueprints: jest.Mock;
    getProviders: jest.Mock;
    getVariants: jest.Mock;
    createProduct: jest.Mock;
    groupVariantsByColor: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock pagination state
    mockCurrentPage = 1;

    // Récupérer le service mocké
    mockPrintifyService = jest.requireMock(
      "@/services/printifyService"
    ).printifyService;

    // Configuration par défaut des mocks
    mockPrintifyService.getBlueprints.mockResolvedValue({
      data: mockBlueprints,
    });
    mockPrintifyService.getProviders.mockResolvedValue({ data: mockProviders });
    mockPrintifyService.getVariants.mockResolvedValue({ data: mockVariants });
    mockPrintifyService.groupVariantsByColor.mockReturnValue({
      Rouge: [mockVariants[0], mockVariants[1]],
      Bleu: [mockVariants[2]],
    });
    mockPrintifyService.createProduct.mockResolvedValue({
      success: true,
      data: { id: "prod_123" },
    });

    // Réinitialiser les mocks pour éviter les états persistants
    mockPrintifyService.getBlueprints.mockClear();
    mockPrintifyService.getProviders.mockClear();
    mockPrintifyService.getVariants.mockClear();
    mockPrintifyService.groupVariantsByColor.mockClear();
    mockPrintifyService.createProduct.mockClear();
  });

  // Helper function to wait for variants to load
  const waitForVariantsToLoad = async () => {
    await waitFor(() => {
      expect(screen.getByText("Rouge")).toBeInTheDocument();
      expect(screen.getByText("Bleu")).toBeInTheDocument();
    });
  };

  describe("Rendu initial et chargement", () => {
    it("affiche l'écran de chargement initial", () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      expect(
        screen.getByText("Chargement des produits disponibles...")
      ).toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("charge les blueprints au montage", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(mockPrintifyService.getBlueprints).toHaveBeenCalledTimes(1);
      });
    });

    it("affiche l'image sélectionnée et ses détails", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Votre image")).toBeInTheDocument();
        expect(screen.getByText("Image de test")).toBeInTheDocument();
        expect(screen.getByAltText("Image de test")).toBeInTheDocument();
      });
    });

    it("initialise le titre et la description avec l'image sélectionnée", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        const titleInput = screen.getByDisplayValue("Produit Image de test");
        const descriptionTextarea = screen.getByDisplayValue(
          "Produit personnalisé créé à partir de: Image de test"
        );

        expect(titleInput).toBeInTheDocument();
        expect(descriptionTextarea).toBeInTheDocument();
      });
    });
  });

  describe("Gestion des erreurs de chargement", () => {
    it("affiche une erreur si le chargement des blueprints échoue", async () => {
      mockPrintifyService.getBlueprints.mockRejectedValue(
        new Error("Erreur réseau")
      );

      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText("Erreur lors du chargement des produits disponibles")
        ).toBeInTheDocument();
      });
    });

    it("affiche une erreur si le chargement des providers échoue", async () => {
      mockPrintifyService.getProviders.mockRejectedValue(
        new Error("Erreur réseau")
      );

      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(async () => {
        // Attendre que les blueprints soient chargés
        await screen.findByText("T-shirt Premium");

        // Cliquer sur un blueprint pour déclencher le chargement des providers
        const blueprintButton = screen
          .getByText("T-shirt Premium")
          .closest("button");
        fireEvent.click(blueprintButton!);

        await waitFor(() => {
          expect(
            screen.getByText("Erreur lors du chargement des fournisseurs")
          ).toBeInTheDocument();
        });
      });
    });

    it("affiche une erreur si le chargement des variants échoue", async () => {
      mockPrintifyService.getVariants.mockRejectedValue(
        new Error("Erreur réseau")
      );

      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(async () => {
        // Attendre que les blueprints soient chargés
        await screen.findByText("T-shirt Premium");

        // Sélectionner un blueprint
        const blueprintButton = screen
          .getByText("T-shirt Premium")
          .closest("button");
        fireEvent.click(blueprintButton!);

        // Attendre que les providers soient chargés
        await screen.findByText("Provider A");

        // Sélectionner un provider
        const providerButton = screen.getByText("Provider A").closest("button");
        fireEvent.click(providerButton!);

        await waitFor(() => {
          expect(
            screen.getByText("Erreur lors du chargement des variants")
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe("Sélection des blueprints", () => {
    it("permet de sélectionner un blueprint", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(blueprintButton).toHaveClass(
          "border-blue-500",
          "bg-blue-50",
          "shadow-md"
        );
      });
    });

    it("permet de changer de blueprint", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
        expect(screen.getByText("Mug Personnalisé")).toBeInTheDocument();
      });

      // Sélectionner le premier blueprint
      const firstBlueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(firstBlueprintButton!);

      // Sélectionner le deuxième blueprint
      const secondBlueprintButton = screen
        .getByText("Mug Personnalisé")
        .closest("button");
      fireEvent.click(secondBlueprintButton!);

      await waitFor(() => {
        expect(firstBlueprintButton).not.toHaveClass(
          "border-blue-500",
          "bg-blue-50",
          "shadow-md"
        );
        expect(secondBlueprintButton).toHaveClass(
          "border-blue-500",
          "bg-blue-50",
          "shadow-md"
        );
      });
    });
  });

  describe("Sélection des providers", () => {
    it("charge les providers après sélection d'un blueprint", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(mockPrintifyService.getProviders).toHaveBeenCalledWith(1);
      });
    });

    it("affiche les providers disponibles", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
        expect(screen.getByText("Provider B")).toBeInTheDocument();
      });
    });

    it("permet de sélectionner un provider", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
      });

      const providerButton = screen.getByText("Provider A").closest("button");
      fireEvent.click(providerButton!);

      await waitFor(() => {
        expect(providerButton).toHaveClass("border-blue-500", "bg-blue-50");
      });
    });
  });

  describe("Sélection des variants", () => {
    it("charge les variants après sélection d'un provider", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
      });

      const providerButton = screen.getByText("Provider A").closest("button");
      fireEvent.click(providerButton!);

      await waitFor(() => {
        expect(mockPrintifyService.getVariants).toHaveBeenCalledWith(1, 1);
      });
    });

    it("affiche les variants disponibles", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
      });

      const providerButton = screen.getByText("Provider A").closest("button");
      fireEvent.click(providerButton!);

      await waitForVariantsToLoad();
    });

    it.skip("permet de sélectionner des variants", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
      });

      const providerButton = screen.getByText("Provider A").closest("button");
      fireEvent.click(providerButton!);

      // Attendre que les couleurs soient affichées et sélectionner une couleur
      await waitForVariantsToLoad();

      const colorButton = screen.getByText("Rouge").closest("button");
      fireEvent.click(colorButton!);

      // Maintenant les tailles devraient être affichées
      await waitFor(() => {
        expect(screen.getByText("S")).toBeInTheDocument();
        expect(screen.getByText("M")).toBeInTheDocument();
      });

      // Vérifier que les variants sont affichés et cliquables
      const variantButton = screen.getByText("S").closest("button");
      expect(variantButton).toBeInTheDocument();

      // Vérifier que le variant a le bon style initial
      expect(variantButton).toHaveClass("border-gray-200");
      expect(variantButton).toHaveClass("hover:border-gray-300");

      // Cliquer sur le variant
      fireEvent.click(variantButton!);

      // Vérifier que le variant est maintenant sélectionné
      await waitFor(() => {
        expect(variantButton).toHaveClass("border-green-500");
        expect(variantButton).toHaveClass("bg-green-50");
        expect(variantButton).toHaveClass("text-green-700");
      });

      // Vérifier que le bouton de création apparaît
      await waitFor(() => {
        expect(screen.getByTestId("create-product-button")).toBeInTheDocument();
      });
    });
  });

  describe("Gestion des filtres", () => {
    it("permet de rechercher des blueprints", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("search-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "T-shirt" } });

      expect(searchInput).toHaveValue("T-shirt");
    });

    it("permet d'effacer les filtres", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("clear-filters")).toBeInTheDocument();
      });

      const clearButton = screen.getByTestId("clear-filters");
      fireEvent.click(clearButton);

      // Vérifier que les filtres sont effacés
      expect(screen.getByTestId("search-input")).toHaveValue("");
    });
  });

  describe("Pagination", () => {
    it("affiche la pagination", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
      });
    });

    it("affiche les informations de pagination correctement", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByTestId("page-info")).toBeInTheDocument();
        expect(screen.getByTestId("next-page")).toBeInTheDocument();
        expect(screen.getByTestId("prev-page")).toBeInTheDocument();
      });

      // Vérifier que les informations de page sont affichées
      expect(screen.getByTestId("page-info")).toHaveTextContent("Page 1 sur 2");
    });
  });

  describe("Création de produit", () => {
    it("permet de créer un produit", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
      });

      const providerButton = screen.getByText("Provider A").closest("button");
      fireEvent.click(providerButton!);

      // Attendre que les couleurs soient affichées et sélectionner une couleur
      await waitForVariantsToLoad();

      const colorButton = screen.getByText("Rouge").closest("button");
      fireEvent.click(colorButton!);

      // Maintenant les tailles devraient être affichées
      await waitFor(() => {
        expect(screen.getByText("S")).toBeInTheDocument();
      });

      const variantButton = screen.getByText("S").closest("button");
      fireEvent.click(variantButton!);

      const createButton = screen.getByTestId("create-product-button");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockPrintifyService.createProduct).toHaveBeenCalled();
      });
    });

    it("appelle le callback onProductCreated après création", async () => {
      mockPrintifyService.createProduct.mockResolvedValue({
        success: true,
        data: { id: "prod_123" },
      });

      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      });

      const blueprintButton = screen
        .getByText("T-shirt Premium")
        .closest("button");
      fireEvent.click(blueprintButton!);

      await waitFor(() => {
        expect(screen.getByText("Provider A")).toBeInTheDocument();
      });

      const providerButton = screen.getByText("Provider A").closest("button");
      fireEvent.click(providerButton!);

      // Attendre que les couleurs soient affichées et sélectionner une couleur
      await waitForVariantsToLoad();

      const colorButton = screen.getByText("Rouge").closest("button");
      fireEvent.click(colorButton!);

      // Maintenant les tailles devraient être affichées
      await waitFor(() => {
        expect(screen.getByText("S")).toBeInTheDocument();
      });

      const variantButton = screen.getByText("S").closest("button");
      fireEvent.click(variantButton!);

      const createButton = screen.getByTestId("create-product-button");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockCallbacks.onProductCreated).toHaveBeenCalledWith("prod_123");
      });
    });
  });

  describe("Annulation", () => {
    it("appelle le callback onCancel", async () => {
      render(
        <ProductCreatorForm
          selectedImage={mockSelectedImage}
          {...mockCallbacks}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Retour")).toBeInTheDocument();
      });

      const cancelButton = screen.getByText("Retour");
      fireEvent.click(cancelButton);

      expect(mockCallbacks.onCancel).toHaveBeenCalled();
    });
  });
});
