"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

// Interface Blueprint étendue pour correspondre aux tests
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

interface ProductFiltersProps {
  blueprints: Blueprint[];
  searchQuery: string;
  selectedBrand: string;
  onSearchChange: (query: string) => void;
  onBrandChange: (brand: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  blueprints,
  searchQuery,
  selectedBrand,
  onSearchChange,
  onBrandChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Obtenir les marques uniques avec le nombre de produits
  const brandCounts = blueprints.reduce((acc, blueprint) => {
    acc[blueprint.brand] = (acc[blueprint.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueBrands = Object.entries(brandCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([brand, count]) => ({ brand, count }));

  const hasActiveFilters = searchQuery || selectedBrand;

  // Gérer la recherche locale et appeler onSearchChange seulement sur blur
  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleSearchBlur = () => {
    if (localSearchQuery !== searchQuery) {
      onSearchChange(localSearchQuery);
    }
  };

  // Mettre à jour la recherche locale quand la prop change
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            data-testid="search-input"
            type="text"
            placeholder="Rechercher par nom, marque ou modèle..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onBlur={handleSearchBlur}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {localSearchQuery && (
            <button
              data-testid="search-clear-button"
              onClick={() => {
                setLocalSearchQuery("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bouton filtres avancés */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
            hasActiveFilters
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <FiFilter className="w-5 h-5" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {(searchQuery ? 1 : 0) + (selectedBrand ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Affichage du nombre de produits (toujours visible) */}
      <div className="text-sm text-gray-600">
        {blueprints.length} produit{blueprints.length > 1 ? "s" : ""} disponible
        {blueprints.length > 1 ? "s" : ""}
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtre par marque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les marques</option>
                {uniqueBrands.map(({ brand, count }) => (
                  <option key={brand} value={brand}>
                    {brand} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Filtres supplémentaires peuvent être ajoutés ici */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tri par
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="name"
              >
                <option value="name">Nom (A-Z)</option>
                <option value="brand">Marque</option>
                <option value="recent">Plus récent</option>
              </select>
            </div>
          </div>

          {/* Actions des filtres */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {blueprints.length} produit{blueprints.length > 1 ? "s" : ""}{" "}
              disponible{blueprints.length > 1 ? "s" : ""}
            </div>

            <div className="flex space-x-3">
              {hasActiveFilters && (
                <button
                  data-testid="clear-filters"
                  onClick={onClearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Effacer tout
                </button>
              )}
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags des filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Recherche: &quot;{searchQuery}&quot;</span>
              <button
                data-testid="search-tag-clear"
                onClick={() => onSearchChange("")}
                className="hover:bg-blue-200 rounded-full p-0.5"
                aria-label="Supprimer la recherche"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}

          {selectedBrand && (
            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <span>Marque: {selectedBrand}</span>
              <button
                data-testid="brand-tag-clear"
                onClick={() => onBrandChange("")}
                className="hover:bg-green-200 rounded-full p-0.5"
                aria-label="Supprimer la marque"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook personnalisé pour gérer les filtres de produits
export function useProductFilters(blueprints: Blueprint[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "brand" | "recent">("name");

  const filteredBlueprints = blueprints
    .filter((blueprint) => {
      const matchesSearch =
        blueprint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blueprint.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blueprint.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blueprint.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = !selectedBrand || blueprint.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "brand":
          return a.brand.localeCompare(b.brand);
        case "name":
          return a.title.localeCompare(b.title);
        case "recent":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSortBy("name");
  };

  const hasActiveFilters = Boolean(searchQuery || selectedBrand);

  return {
    searchQuery,
    selectedBrand,
    sortBy,
    filteredBlueprints,
    hasActiveFilters,
    setSearchQuery,
    setSelectedBrand,
    setSortBy,
    clearFilters,
  };
}
