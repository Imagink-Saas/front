import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomProductCreator from "../page";

// Mock des icônes Lucide
jest.mock("lucide-react", () => ({
  ShoppingCart: () => <div data-testid="shopping-cart-icon">🛒</div>,
  Upload: () => <div data-testid="upload-icon">📤</div>,
  Package: () => <div data-testid="package-icon">📦</div>,
  Palette: () => <div data-testid="palette-icon">🎨</div>,
  DollarSign: () => <div data-testid="dollar-sign-icon">💰</div>,
  Check: () => <div data-testid="check-icon">✅</div>,
  ArrowLeft: () => <div data-testid="arrow-left-icon">⬅️</div>,
}));

// Mock de fetch global
global.fetch = jest.fn();

describe("CustomProductCreator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Vue Galerie", () => {
    it("affiche la galerie d'images par défaut", () => {
      render(<CustomProductCreator />);

      expect(screen.getByText("Ma Galerie IA")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Sélectionnez une image pour créer votre produit personnalisé"
        )
      ).toBeInTheDocument();

      // Vérifier que les 4 images sont affichées
      expect(screen.getByText("Paysage Fantastique")).toBeInTheDocument();
      expect(screen.getByText("Montagne Abstraite")).toBeInTheDocument();
      expect(screen.getByText("Art Numérique")).toBeInTheDocument();
      expect(screen.getByText("Design Moderne")).toBeInTheDocument();
    });

    it("affiche les boutons de création pour chaque image", () => {
      render(<CustomProductCreator />);

      const createButtons = screen.getAllByText("Créer un produit");
      expect(createButtons).toHaveLength(4);

      createButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("bg-blue-600");
      });
    });

    it("passe à la vue formulaire lors du clic sur une image", async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);

      // Vérifier que nous sommes dans la vue formulaire
      expect(
        screen.getByText("Créer votre produit personnalisé")
      ).toBeInTheDocument();
      expect(screen.getByText("Retour à la galerie")).toBeInTheDocument();
    });
  });

  describe("Vue Formulaire", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      // Aller à la vue formulaire
      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);
    });

    it("affiche l'aperçu de l'image sélectionnée", () => {
      expect(screen.getByText("Image sélectionnée")).toBeInTheDocument();
      expect(screen.getByText("Paysage Fantastique")).toBeInTheDocument();
    });

    it("affiche le bouton retour à la galerie", () => {
      const backButton = screen.getByText("Retour à la galerie");
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveClass("text-blue-600");
    });

    it("permet de sélectionner le type de produit", async () => {
      const user = userEvent.setup();
      const productSelect = screen.getByDisplayValue("Sélectionnez un produit");

      await user.selectOptions(productSelect, "tshirt");

      expect(productSelect).toHaveValue("tshirt");
    });

    it("affiche les fournisseurs après sélection du type de produit", async () => {
      const user = userEvent.setup();
      const productSelect = screen.getByDisplayValue("Sélectionnez un produit");

      await user.selectOptions(productSelect, "tshirt");

      const supplierSelect = screen.getByDisplayValue(
        "Sélectionnez un fournisseur"
      );
      expect(supplierSelect).toBeInTheDocument();
      expect(screen.getByText("Printify Choice")).toBeInTheDocument();
      expect(screen.getByText("Monster Digital")).toBeInTheDocument();
      expect(screen.getByText("Gooten")).toBeInTheDocument();
    });

    it("affiche les tailles après sélection du type de produit", async () => {
      const user = userEvent.setup();
      const productSelect = screen.getByDisplayValue("Sélectionnez un produit");

      await user.selectOptions(productSelect, "tshirt");

      const sizeSelect = screen.getByDisplayValue("Sélectionnez une taille");
      expect(sizeSelect).toBeInTheDocument();
      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("L")).toBeInTheDocument();
      expect(screen.getByText("XL")).toBeInTheDocument();
      expect(screen.getByText("XXL")).toBeInTheDocument();
    });

    it("affiche les couleurs après sélection de la taille", async () => {
      const user = userEvent.setup();
      const productSelect = screen.getByDisplayValue("Sélectionnez un produit");

      // D'abord sélectionner le type de produit pour afficher la taille
      await user.selectOptions(productSelect, "tshirt");

      // Maintenant la taille doit être visible
      const sizeSelect = screen.getByDisplayValue("Sélectionnez une taille");
      expect(sizeSelect).toBeInTheDocument();

      // Sélectionner une taille pour afficher la couleur
      await user.selectOptions(sizeSelect, "M");

      // Maintenant la couleur doit être visible
      const colorSelect = screen.getByDisplayValue("Sélectionnez une couleur");
      expect(colorSelect).toBeInTheDocument();
      expect(screen.getByText("Blanc")).toBeInTheDocument();
      expect(screen.getByText("Noir")).toBeInTheDocument();
      expect(screen.getByText("Gris")).toBeInTheDocument();
      expect(screen.getByText("Marine")).toBeInTheDocument();
    });

    it("permet de saisir le nom du produit", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByPlaceholderText(
        "Ex: Mon T-shirt artistique"
      );

      await user.type(nameInput, "Mon T-shirt personnalisé");

      expect(nameInput).toHaveValue("Mon T-shirt personnalisé");
    });

    it("permet de saisir la description", async () => {
      const user = userEvent.setup();
      const descriptionTextarea = screen.getByPlaceholderText(
        "Décrivez votre produit..."
      );

      await user.type(descriptionTextarea, "Un t-shirt unique avec mon design");

      expect(descriptionTextarea).toHaveValue(
        "Un t-shirt unique avec mon design"
      );
    });

    it("calcule le prix final avec la marge par défaut", async () => {
      const user = userEvent.setup();
      const productSelect = screen.getByDisplayValue("Sélectionnez un produit");

      // Sélectionner le type de produit
      await user.selectOptions(productSelect, "tshirt");

      // Sélectionner une taille pour calculer le prix
      const sizeSelect = screen.getByDisplayValue("Sélectionnez une taille");
      await user.selectOptions(sizeSelect, "M");

      // Le prix de base est 12.5€, avec 40% de marge = 17.5€
      expect(screen.getByText("17.50 €")).toBeInTheDocument();
    });

    it("désactive le bouton de création si le formulaire est incomplet", async () => {
      const user = userEvent.setup();
      const createButton = screen.getByText("Créer le produit");

      // Le bouton doit être désactivé par défaut
      expect(createButton).toBeDisabled();

      // Remplir partiellement le formulaire
      const productSelect = screen.getByDisplayValue("Sélectionnez un produit");
      await user.selectOptions(productSelect, "tshirt");

      // Le bouton doit toujours être désactivé car il manque d'autres champs
      expect(createButton).toBeDisabled();
    });

    it("active le bouton de création quand le formulaire est complet", async () => {
      const user = userEvent.setup();

      // Remplir complètement le formulaire étape par étape
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "tshirt"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un fournisseur"),
        "Printify Choice"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "M"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une couleur"),
        "Blanc"
      );
      await user.type(
        screen.getByPlaceholderText("Ex: Mon T-shirt artistique"),
        "Mon produit"
      );
      await user.type(
        screen.getByPlaceholderText("Décrivez votre produit..."),
        "Description"
      );

      const createButton = screen.getByText("Créer le produit");
      expect(createButton).not.toBeDisabled();
    });

    it("réinitialise les champs dépendants lors du changement de type de produit", async () => {
      const user = userEvent.setup();

      // Remplir le formulaire étape par étape
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "tshirt"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un fournisseur"),
        "Printify Choice"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "M"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une couleur"),
        "Blanc"
      );

      // Changer le type de produit
      await user.selectOptions(
        screen.getByDisplayValue("T-shirt Premium"),
        "mug"
      );

      // Les champs dépendants doivent être réinitialisés et cachés
      expect(
        screen.queryByDisplayValue("Printify Choice")
      ).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("M")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("Blanc")).not.toBeInTheDocument();
    });

    it("réinitialise la couleur lors du changement de taille", async () => {
      const user = userEvent.setup();

      // Remplir le formulaire étape par étape
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "tshirt"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "M"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une couleur"),
        "Blanc"
      );

      // Changer la taille
      await user.selectOptions(screen.getByDisplayValue("M"), "L");

      // La couleur doit être réinitialisée
      expect(
        screen.getByDisplayValue("Sélectionnez une couleur")
      ).toBeInTheDocument();
    });
  });

  describe("Création de produit", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      // Aller à la vue formulaire et remplir le formulaire
      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);

      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "tshirt"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un fournisseur"),
        "Printify Choice"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "M"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une couleur"),
        "Blanc"
      );
      await user.type(
        screen.getByPlaceholderText("Ex: Mon T-shirt artistique"),
        "Mon produit"
      );
      await user.type(
        screen.getByPlaceholderText("Décrivez votre produit..."),
        "Description"
      );
    });

    it("affiche l'état de chargement lors de la création", async () => {
      const user = userEvent.setup();
      const createButton = screen.getByText("Créer le produit");

      await user.click(createButton);

      expect(screen.getByText("Création en cours...")).toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });

    it("passe à la vue confirmation après création réussie", async () => {
      const user = userEvent.setup();
      const createButton = screen.getByText("Créer le produit");

      await user.click(createButton);

      // Attendre que la création soit terminée
      await waitFor(
        () => {
          expect(
            screen.getByText("Produit créé avec succès !")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Vue Confirmation", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      // Aller à la vue formulaire, remplir et créer le produit
      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);

      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "tshirt"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un fournisseur"),
        "Printify Choice"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "M"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une couleur"),
        "Blanc"
      );
      await user.type(
        screen.getByPlaceholderText("Ex: Mon T-shirt artistique"),
        "Mon produit"
      );
      await user.type(
        screen.getByPlaceholderText("Décrivez votre produit..."),
        "Description"
      );

      const createButton = screen.getByText("Créer le produit");
      await user.click(createButton);

      // Attendre la confirmation
      await waitFor(
        () => {
          expect(
            screen.getByText("Produit créé avec succès !")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("affiche les détails du produit créé", () => {
      expect(screen.getByText("T-shirt Premium")).toBeInTheDocument();
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("Blanc")).toBeInTheDocument();
      expect(screen.getByText("17.50 €")).toBeInTheDocument();
    });

    it("affiche le bouton pour voir le produit dans la boutique", () => {
      const shopButton = screen.getByText("Voir le produit dans ma boutique");
      expect(shopButton).toBeInTheDocument();
      expect(shopButton).toHaveClass("bg-blue-600");
    });

    it("affiche le bouton pour créer un autre produit", () => {
      const createAnotherButton = screen.getByText("Créer un autre produit");
      expect(createAnotherButton).toBeInTheDocument();
      expect(createAnotherButton).toHaveClass("bg-gray-100");
    });

    it("retourne à la galerie lors du clic sur 'Créer un autre produit'", async () => {
      const user = userEvent.setup();
      const createAnotherButton = screen.getByText("Créer un autre produit");

      await user.click(createAnotherButton);

      expect(screen.getByText("Ma Galerie IA")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Sélectionnez une image pour créer votre produit personnalisé"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("permet de retourner à la galerie depuis le formulaire", async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      // Aller au formulaire
      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);

      // Retourner à la galerie
      const backButton = screen.getByText("Retour à la galerie");
      await user.click(backButton);

      expect(screen.getByText("Ma Galerie IA")).toBeInTheDocument();
    });
  });

  describe("Calculs de prix", () => {
    it("calcule correctement le prix pour différentes tailles de t-shirt", async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      // Aller au formulaire
      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);

      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "tshirt"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un fournisseur"),
        "Printify Choice"
      );

      // Tester différentes tailles
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "S"
      );
      expect(screen.getByText("17.50 €")).toBeInTheDocument(); // 12.5 * 1.4

      await user.selectOptions(screen.getByDisplayValue("S"), "L");
      expect(screen.getByText("18.20 €")).toBeInTheDocument(); // 13.0 * 1.4

      await user.selectOptions(screen.getByDisplayValue("L"), "XXL");
      expect(screen.getByText("19.60 €")).toBeInTheDocument(); // 14.0 * 1.4
    });

    it("calcule correctement le prix pour différents types de produits", async () => {
      const user = userEvent.setup();
      render(<CustomProductCreator />);

      // Aller au formulaire
      const firstCreateButton = screen.getAllByText("Créer un produit")[0];
      await user.click(firstCreateButton);

      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un produit"),
        "mug"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez un fournisseur"),
        "Printify Choice"
      );
      await user.selectOptions(
        screen.getByDisplayValue("Sélectionnez une taille"),
        "11oz"
      );

      expect(screen.getByText("12.25 €")).toBeInTheDocument(); // 8.75 * 1.4
    });
  });
});
