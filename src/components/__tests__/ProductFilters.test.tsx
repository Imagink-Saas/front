import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductFilters, { useProductFilters } from "../ProductFilters";

// Composant de test pour tester le hook useProductFilters
function TestHookComponent({ blueprints }: { blueprints: Blueprint[] }) {
  const filters = useProductFilters(blueprints);

  return (
    <div>
      <div data-testid="filtered-count">
        {filters.filteredBlueprints.length}
      </div>
      <div data-testid="has-active-filters">
        {filters.hasActiveFilters.toString()}
      </div>
      <div data-testid="search-query">{filters.searchQuery}</div>
      <div data-testid="selected-brand">{filters.selectedBrand}</div>
      <div data-testid="sort-by">{filters.sortBy}</div>

      <input
        data-testid="hook-search-input"
        value={filters.searchQuery}
        onChange={(e) => filters.setSearchQuery(e.target.value)}
        placeholder="Recherche"
      />

      <select
        data-testid="hook-brand-select"
        value={filters.selectedBrand}
        onChange={(e) => filters.setSelectedBrand(e.target.value)}
      >
        <option value="">Toutes les marques</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
      </select>

      <select
        data-testid="hook-sort-select"
        value={filters.sortBy}
        onChange={(e) =>
          filters.setSortBy(e.target.value as "name" | "brand" | "recent")
        }
      >
        <option value="name">Nom</option>
        <option value="brand">Marque</option>
        <option value="recent">Récent</option>
      </select>

      <button onClick={filters.clearFilters} data-testid="hook-clear-filters">
        Effacer
      </button>

      <div data-testid="filtered-items">
        {filters.filteredBlueprints.map((item, index) => (
          <div key={index} data-testid={`item-${index}`}>
            {item.title} - {item.brand}
          </div>
        ))}
      </div>
    </div>
  );
}

// Interface Blueprint pour les tests
interface Blueprint {
  id: number;
  title: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  tags: string[];
  print_areas: string[];
  variants: unknown[];
  mockups: unknown[];
  created_at: string;
  updated_at: string;
}

// Mock des données de test
const mockBlueprints: Blueprint[] = [
  {
    id: 1,
    title: "T-shirt Classic",
    brand: "Nike",
    model: "Classic",
    description: "T-shirt confortable en coton",
    category: "Vêtements",
    tags: ["t-shirt", "coton"],
    print_areas: ["front", "back"],
    variants: [],
    mockups: [],
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 2,
    title: "Casquette Sport",
    brand: "Adidas",
    model: "Sport",
    description: "Casquette de sport légère",
    category: "Accessoires",
    tags: ["casquette", "sport"],
    print_areas: ["front"],
    variants: [],
    mockups: [],
    created_at: "2024-01-02",
    updated_at: "2024-01-02",
  },
  {
    id: 3,
    title: "Mug Premium",
    brand: "Nike",
    model: "Premium",
    description: "Mug en céramique de haute qualité",
    category: "Maison",
    tags: ["mug", "céramique"],
    print_areas: ["front", "back"],
    variants: [],
    mockups: [],
    created_at: "2024-01-03",
    updated_at: "2024-01-03",
  },
];

describe("ProductFilters Component", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnBrandChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("affiche la barre de recherche", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByTestId("search-input")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Rechercher par nom, marque ou modèle...")
      ).toBeInTheDocument();
    });

    it("affiche le bouton des filtres", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByText("Filtres")).toBeInTheDocument();
    });

    it("affiche le nombre de produits disponibles", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByText("3 produits disponibles")).toBeInTheDocument();
    });
  });

  describe("Fonctionnalité de recherche", () => {
    it("appelle onSearchChange quand l'utilisateur tape dans la barre de recherche", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const searchInput = screen.getByTestId("search-input");
      await user.type(searchInput, "t-shirt");

      // Simuler le blur pour déclencher onSearchChange
      await user.tab();

      // Vérifier que onSearchChange a été appelé avec la valeur finale
      expect(mockOnSearchChange).toHaveBeenCalledWith("t-shirt");
    });

    it("affiche le bouton de suppression de la recherche quand il y a du texte", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const clearButton = screen.getByTestId("search-clear-button");
      expect(clearButton).toBeInTheDocument();
    });

    it("appelle onSearchChange avec une chaîne vide quand on clique sur le bouton de suppression", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const clearButton = screen.getByTestId("search-clear-button");
      await user.click(clearButton);

      expect(mockOnSearchChange).toHaveBeenCalledWith("");
    });
  });

  describe("Filtres avancés", () => {
    it("affiche les filtres avancés quand on clique sur le bouton Filtres", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const filtersButton = screen.getByText("Filtres");
      await user.click(filtersButton);

      // Utiliser getAllByText pour éviter l'ambiguïté
      const marqueElements = screen.getAllByText("Marque");
      expect(marqueElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Tri par")).toBeInTheDocument();
    });

    it("affiche les marques avec le nombre de produits", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const filtersButton = screen.getByText("Filtres");
      await user.click(filtersButton);

      const brandSelect = screen.getByDisplayValue("Toutes les marques");
      expect(brandSelect).toBeInTheDocument();

      // Vérifier que les options sont présentes
      expect(screen.getByText("Nike (2)")).toBeInTheDocument();
      expect(screen.getByText("Adidas (1)")).toBeInTheDocument();
    });

    it("appelle onBrandChange quand on sélectionne une marque", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const filtersButton = screen.getByText("Filtres");
      await user.click(filtersButton);

      const brandSelect = screen.getByDisplayValue("Toutes les marques");
      await user.selectOptions(brandSelect, "Nike");

      expect(mockOnBrandChange).toHaveBeenCalledWith("Nike");
    });

    it("affiche le bouton 'Effacer tout' quand il y a des filtres actifs", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const filtersButton = screen.getByText("Filtres");
      await user.click(filtersButton);

      expect(screen.getByTestId("clear-filters")).toBeInTheDocument();
    });

    it("appelle onClearFilters quand on clique sur 'Effacer tout'", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const filtersButton = screen.getByText("Filtres");
      await user.click(filtersButton);

      const clearButton = screen.getByTestId("clear-filters");
      await user.click(clearButton);

      expect(mockOnClearFilters).toHaveBeenCalled();
    });
  });

  describe("Tags des filtres actifs", () => {
    it("affiche le tag de recherche quand il y a une requête", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByText('Recherche: "t-shirt"')).toBeInTheDocument();
    });

    it("affiche le tag de marque quand une marque est sélectionnée", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand="Nike"
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByText("Marque: Nike")).toBeInTheDocument();
    });

    it("permet de supprimer le tag de recherche", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const searchTag = screen.getByText('Recherche: "t-shirt"');
      const removeButton = searchTag.parentElement?.querySelector("button");

      if (removeButton) {
        await user.click(removeButton);
        expect(mockOnSearchChange).toHaveBeenCalledWith("");
      }
    });

    it("permet de supprimer le tag de marque", async () => {
      const user = userEvent.setup();

      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand="Nike"
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      const brandTag = screen.getByText("Marque: Nike");
      const removeButton = brandTag.parentElement?.querySelector("button");

      if (removeButton) {
        await user.click(removeButton);
        expect(mockOnBrandChange).toHaveBeenCalledWith("");
      }
    });
  });

  describe("États visuels", () => {
    it("renders the component without crashing", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery=""
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByText("Filtres")).toBeInTheDocument();
    });

    it("renders with search query", () => {
      const { debug } = render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      debug();
      expect(screen.getByText("Filtres")).toBeInTheDocument();
    });

    it("met en surbrillance le bouton Filtres quand il y a des filtres actifs", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand=""
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      // Find the button by role to ensure we get the actual button element
      const filtersButton = screen.getByRole("button", { name: /filtres/i });

      // Check if the button exists first
      expect(filtersButton).toBeInTheDocument();

      // Check that the button has the expected blue styling classes when filters are active
      expect(filtersButton).toHaveClass("border-blue-500");
      expect(filtersButton).toHaveClass("bg-blue-50");
      expect(filtersButton).toHaveClass("text-blue-700");
    });

    it("affiche le badge du nombre de filtres actifs", () => {
      render(
        <ProductFilters
          blueprints={mockBlueprints}
          searchQuery="t-shirt"
          selectedBrand="Nike"
          onSearchChange={mockOnSearchChange}
          onBrandChange={mockOnBrandChange}
          onClearFilters={mockOnClearFilters}
        />
      );

      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});

describe("useProductFilters Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("filtre les produits par recherche", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const searchInput = screen.getByTestId("hook-search-input");
    fireEvent.change(searchInput, { target: { value: "t-shirt" } });

    expect(screen.getByTestId("filtered-count")).toHaveTextContent("1");
    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "T-shirt Classic - Nike"
    );
  });

  it("filtre les produits par marque", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const brandSelect = screen.getByTestId("hook-brand-select");
    fireEvent.change(brandSelect, { target: { value: "Nike" } });

    expect(screen.getByTestId("filtered-count")).toHaveTextContent("2");
    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "Mug Premium - Nike"
    );
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "T-shirt Classic - Nike"
    );
  });

  it("combine les filtres de recherche et de marque", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const searchInput = screen.getByTestId("hook-search-input");
    const brandSelect = screen.getByTestId("hook-brand-select");

    fireEvent.change(searchInput, { target: { value: "mug" } });
    fireEvent.change(brandSelect, { target: { value: "Nike" } });

    expect(screen.getByTestId("filtered-count")).toHaveTextContent("1");
    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "Mug Premium - Nike"
    );
  });

  it("trie les produits par nom par défaut", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "Casquette Sport - Adidas"
    );
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "Mug Premium - Nike"
    );
    expect(screen.getByTestId("item-2")).toHaveTextContent(
      "T-shirt Classic - Nike"
    );
  });

  it("trie les produits par marque", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const sortSelect = screen.getByTestId("hook-sort-select");
    fireEvent.change(sortSelect, { target: { value: "brand" } });

    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "Casquette Sport - Adidas"
    );
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "T-shirt Classic - Nike"
    );
    expect(screen.getByTestId("item-2")).toHaveTextContent(
      "Mug Premium - Nike"
    );
  });

  it("trie les produits par date de création (récent)", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const sortSelect = screen.getByTestId("hook-sort-select");
    fireEvent.change(sortSelect, { target: { value: "recent" } });

    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "Mug Premium - Nike"
    );
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "Casquette Sport - Adidas"
    );
    expect(screen.getByTestId("item-2")).toHaveTextContent(
      "T-shirt Classic - Nike"
    );
  });

  it("efface tous les filtres", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    // Appliquer des filtres
    const searchInput = screen.getByTestId("hook-search-input");
    const brandSelect = screen.getByTestId("hook-brand-select");

    fireEvent.change(searchInput, { target: { value: "t-shirt" } });
    fireEvent.change(brandSelect, { target: { value: "Nike" } });

    // Vérifier que les filtres sont appliqués
    expect(screen.getByTestId("search-query")).toHaveTextContent("t-shirt");
    expect(screen.getByTestId("selected-brand")).toHaveTextContent("Nike");

    // Effacer les filtres
    const clearButton = screen.getByTestId("hook-clear-filters");
    fireEvent.click(clearButton);

    // Vérifier que les filtres sont effacés
    expect(screen.getByTestId("search-query")).toHaveTextContent("");
    expect(screen.getByTestId("selected-brand")).toHaveTextContent("");
    expect(screen.getByTestId("sort-by")).toHaveTextContent("name");
    expect(screen.getByTestId("filtered-count")).toHaveTextContent("3");
  });

  it("détecte correctement les filtres actifs", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    // Initialement, pas de filtres actifs
    expect(screen.getByTestId("has-active-filters")).toHaveTextContent("false");

    // Ajouter un filtre de recherche
    const searchInput = screen.getByTestId("hook-search-input");
    fireEvent.change(searchInput, { target: { value: "t-shirt" } });

    expect(screen.getByTestId("has-active-filters")).toHaveTextContent("true");

    // Ajouter un filtre de marque
    const brandSelect = screen.getByTestId("hook-brand-select");
    fireEvent.change(brandSelect, { target: { value: "Nike" } });

    expect(screen.getByTestId("has-active-filters")).toHaveTextContent("true");
  });

  it("gère la recherche insensible à la casse", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const searchInput = screen.getByTestId("hook-search-input");
    fireEvent.change(searchInput, { target: { value: "T-SHIRT" } });

    expect(screen.getByTestId("filtered-count")).toHaveTextContent("1");
    expect(screen.getByTestId("item-0")).toHaveTextContent(
      "T-shirt Classic - Nike"
    );
  });

  it("recherche dans tous les champs (titre, marque, modèle, description)", () => {
    render(<TestHookComponent blueprints={mockBlueprints} />);

    const searchInput = screen.getByTestId("hook-search-input");

    // Recherche par marque
    fireEvent.change(searchInput, { target: { value: "nike" } });
    expect(screen.getByTestId("filtered-count")).toHaveTextContent("2");

    // Recherche par modèle
    fireEvent.change(searchInput, { target: { value: "classic" } });
    expect(screen.getByTestId("filtered-count")).toHaveTextContent("1");

    // Recherche par description
    fireEvent.change(searchInput, { target: { value: "coton" } });
    expect(screen.getByTestId("filtered-count")).toHaveTextContent("1");
  });
});
