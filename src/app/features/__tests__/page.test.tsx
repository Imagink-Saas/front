import React from "react";
import { render, screen } from "@testing-library/react";
import FeaturesPage from "../page";

// Mock des icônes Lucide
jest.mock("lucide-react", () => ({
  Sparkles: () => <div data-testid="sparkles-icon">✨</div>,
  ShoppingCart: () => <div data-testid="shopping-cart-icon">🛒</div>,
  Palette: () => <div data-testid="palette-icon">🎨</div>,
  Database: () => <div data-testid="database-icon">💾</div>,
  Bell: () => <div data-testid="bell-icon">🔔</div>,
  CreditCard: () => <div data-testid="credit-card-icon">💳</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">✅</div>,
  Zap: () => <div data-testid="zap-icon">⚡</div>,
  Shield: () => <div data-testid="shield-icon">🛡️</div>,
  Globe: () => <div data-testid="globe-icon">🌐</div>,
  Smartphone: () => <div data-testid="smartphone-icon">📱</div>,
}));

// Mock de Next.js Link
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLAnchorElement>) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("FeaturesPage", () => {
  beforeEach(() => {
    render(<FeaturesPage />);
  });

  describe("Hero Section", () => {
    it("affiche le titre principal", () => {
      expect(screen.getByText("Découvrez toutes nos")).toBeInTheDocument();
      expect(screen.getByText("fonctionnalités")).toBeInTheDocument();
    });

    it("affiche la description de la plateforme", () => {
      expect(
        screen.getByText(
          "Imagink combine IA, e-commerce et créativité pour vous offrir une plateforme complète de création et de vente de produits personnalisés."
        )
      ).toBeInTheDocument();
    });

    it("affiche le bouton CTA principal", () => {
      const ctaButtons = screen.getAllByText("Commencer maintenant");
      expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
      const firstButton = ctaButtons[0];
      expect(firstButton).toBeInTheDocument();
      expect(firstButton).toHaveAttribute("href", "/generate");
      expect(firstButton).toHaveClass("bg-black");
    });

    it("affiche l'emoji dans le bouton CTA", () => {
      const emojis = screen.getAllByText("✨");
      expect(emojis.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Features Grid", () => {
    it("affiche le titre de la section", () => {
      expect(
        screen.getByText("Fonctionnalités principales")
      ).toBeInTheDocument();
    });

    it("affiche la description de la section", () => {
      expect(
        screen.getByText(
          "Une suite complète d'outils pour créer, personnaliser et vendre vos créations"
        )
      ).toBeInTheDocument();
    });

    it("affiche toutes les fonctionnalités principales", () => {
      // Vérifier que toutes les fonctionnalités sont présentes
      expect(screen.getByText("Génération d'Images IA")).toBeInTheDocument();
      expect(
        screen.getByText("E-commerce Print-on-Demand")
      ).toBeInTheDocument();
      expect(screen.getByText("Créateur de Produits")).toBeInTheDocument();
      expect(
        screen.getByText("Gestion de Base de Données")
      ).toBeInTheDocument();
      expect(screen.getByText("Système de Notifications")).toBeInTheDocument();
      expect(screen.getByText("Paiements Sécurisés")).toBeInTheDocument();
    });

    it("affiche les icônes des fonctionnalités", () => {
      expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shopping-cart-icon")).toBeInTheDocument();
      expect(screen.getByTestId("palette-icon")).toBeInTheDocument();
      expect(screen.getByTestId("database-icon")).toBeInTheDocument();
      expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
      expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
    });

    it("affiche les descriptions des fonctionnalités", () => {
      expect(
        screen.getByText(
          "Créez des images uniques avec l'IA Stable Diffusion 3.5. Transformez vos idées en visuels époustouflants en quelques secondes."
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Vendez vos créations sur des produits physiques avec l'intégration Printify. De l'idée à la vente en quelques clics."
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Personnalisez vos images sur différents supports : t-shirts, mugs, tote bags, et bien plus encore."
        )
      ).toBeInTheDocument();
    });

    it("affiche les points forts de chaque fonctionnalité", () => {
      // Vérifier quelques points forts clés
      expect(screen.getByText("Prompts textuels avancés")).toBeInTheDocument();
      expect(
        screen.getByText("Résolutions personnalisables")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Catalogue de produits variés")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Intégration Printify complète")
      ).toBeInTheDocument();
      expect(screen.getByText("Interface drag & drop")).toBeInTheDocument();
      expect(screen.getByText("Stockage cloud sécurisé")).toBeInTheDocument();
      expect(
        screen.getByText("Notifications en temps réel")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Paiements Stripe sécurisés")
      ).toBeInTheDocument();
    });

    it("affiche les icônes de validation pour chaque point fort", () => {
      const checkIcons = screen.getAllByTestId("check-circle-icon");
      expect(checkIcons.length).toBeGreaterThan(0);
    });
  });

  describe("How it Works Section", () => {
    it("affiche le titre de la section", () => {
      expect(screen.getByText("Comment ça marche")).toBeInTheDocument();
    });

    it("affiche la description de la section", () => {
      expect(
        screen.getByText(
          "Un processus simple en 4 étapes pour transformer vos idées en business"
        )
      ).toBeInTheDocument();
    });

    it("affiche toutes les étapes du processus", () => {
      // Les étapes utilisent des emojis au lieu de chiffres
      expect(screen.getByText("Décrivez votre idée")).toBeInTheDocument();
      expect(screen.getByText("Admirez la magie")).toBeInTheDocument();
      expect(screen.getByText("Personnalisez")).toBeInTheDocument();
      expect(screen.getByText("Vendez & partagez")).toBeInTheDocument();
    });

    it("affiche les titres des étapes", () => {
      expect(screen.getByText("Décrivez votre idée")).toBeInTheDocument();
      expect(screen.getByText("Admirez la magie")).toBeInTheDocument();
      expect(screen.getByText("Personnalisez")).toBeInTheDocument();
      expect(screen.getByText("Vendez & partagez")).toBeInTheDocument();
    });

    it("affiche les descriptions des étapes", () => {
      expect(
        screen.getByText(
          "Saisissez une phrase, une description ou un concept : notre IA générera une image unique à partir de votre texte."
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Notre moteur IA transforme instantanément votre texte en une image originale et de haute qualité."
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Adaptez votre création aux différents produits et supports disponibles."
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Sélectionnez un produit et imprimez votre création via Printify, ou partagez-la avec le monde."
        )
      ).toBeInTheDocument();
    });

    it("affiche les emojis des étapes", () => {
      expect(screen.getByText("👁️")).toBeInTheDocument();
      const emojis = screen.getAllByText("✨");
      expect(emojis.length).toBeGreaterThanOrEqual(1);
      const paletteEmojis = screen.getAllByText("🎨");
      expect(paletteEmojis.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("🛍️")).toBeInTheDocument();
    });
  });

  describe("Benefits Section", () => {
    it("affiche le titre de la section", () => {
      expect(
        screen.getByText("Pourquoi choisir Imagink ?")
      ).toBeInTheDocument();
    });

    it("affiche la description de la section", () => {
      expect(
        screen.getByText(
          "Une plateforme moderne conçue pour les créateurs et entrepreneurs"
        )
      ).toBeInTheDocument();
    });

    it("affiche tous les avantages", () => {
      expect(screen.getByText("Rapidité")).toBeInTheDocument();
      expect(screen.getByText("Sécurité")).toBeInTheDocument();
      expect(screen.getByText("Accessibilité")).toBeInTheDocument();
      expect(screen.getByText("Responsive")).toBeInTheDocument();
    });

    it("affiche les descriptions des avantages", () => {
      expect(
        screen.getByText("Génération d'images en quelques secondes")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Données protégées et paiements sécurisés")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Disponible 24/7 depuis n'importe où")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Interface adaptée à tous les écrans")
      ).toBeInTheDocument();
    });

    it("affiche les icônes des avantages", () => {
      expect(screen.getByTestId("zap-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
      expect(screen.getByTestId("smartphone-icon")).toBeInTheDocument();
    });

    it("affiche les emojis des avantages", () => {
      expect(screen.getByText("⚡")).toBeInTheDocument();
      expect(screen.getByText("🛡️")).toBeInTheDocument();
      expect(screen.getByText("🌐")).toBeInTheDocument();
      expect(screen.getByText("📱")).toBeInTheDocument();
    });
  });

  describe("Stats Section", () => {
    it("affiche le titre de la section", () => {
      expect(screen.getByText("Nos chiffres")).toBeInTheDocument();
    });

    it("affiche la description de la section", () => {
      expect(
        screen.getByText("Imagink en quelques statistiques")
      ).toBeInTheDocument();
    });

    it("affiche toutes les statistiques", () => {
      expect(screen.getByText("10K+")).toBeInTheDocument();
      expect(screen.getByText("5K+")).toBeInTheDocument();
      expect(screen.getByText("1K+")).toBeInTheDocument();
      expect(screen.getByText("99.9%")).toBeInTheDocument();
    });

    it("affiche les labels des statistiques", () => {
      expect(screen.getByText("Images générées")).toBeInTheDocument();
      expect(screen.getByText("Produits créés")).toBeInTheDocument();
      expect(screen.getByText("Utilisateurs actifs")).toBeInTheDocument();
      expect(screen.getByText("Disponibilité")).toBeInTheDocument();
    });

    it("affiche les statistiques avec la bonne couleur", () => {
      const stats = screen.getAllByText(/10K\+|5K\+|1K\+|99\.9%/);
      stats.forEach((stat) => {
        expect(stat).toHaveClass("text-blue-500");
      });
    });
  });

  describe("CTA Section", () => {
    it("affiche le titre de la section", () => {
      expect(
        screen.getByText("Prêt à commencer votre aventure créative ?")
      ).toBeInTheDocument();
    });

    it("affiche la description de la section", () => {
      expect(
        screen.getByText(
          "Rejoignez des milliers de créateurs qui utilisent déjà Imagink pour transformer leurs idées en business."
        )
      ).toBeInTheDocument();
    });

    it("affiche le bouton CTA final", () => {
      const ctaButtons = screen.getAllByText("Commencer maintenant");
      expect(ctaButtons.length).toBeGreaterThanOrEqual(2); // Il y a 2 boutons avec ce texte
      const secondButton = ctaButtons[1];
      expect(secondButton).toBeInTheDocument();
      expect(secondButton).toHaveAttribute("href", "/generate");
      expect(secondButton).toHaveClass("bg-black");
    });

    it("affiche l'emoji dans le bouton CTA final", () => {
      const emojis = screen.getAllByText("✨");
      expect(emojis.length).toBeGreaterThanOrEqual(2); // Au moins 2 emojis (un dans chaque bouton)
    });
  });

  describe("Responsive Design", () => {
    it("utilise des classes responsive pour la grille des fonctionnalités", () => {
      const featuresSection = screen
        .getByText("Fonctionnalités principales")
        .closest("section");
      expect(featuresSection).toBeInTheDocument();

      // Vérifier que la grille utilise des classes responsive
      const grid = featuresSection?.querySelector(".grid");
      expect(grid).toHaveClass(
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3"
      );
    });

    it("utilise des classes responsive pour la grille des avantages", () => {
      const benefitsSection = screen
        .getByText("Pourquoi choisir Imagink ?")
        .closest("section");
      expect(benefitsSection).toBeInTheDocument();

      const grid = benefitsSection?.querySelector(".grid");
      expect(grid).toHaveClass(
        "grid-cols-2",
        "sm:grid-cols-2",
        "lg:grid-cols-4"
      );
    });

    it("utilise des classes responsive pour la grille des statistiques", () => {
      const statsSection = screen.getByText("Nos chiffres").closest("section");
      expect(statsSection).toBeInTheDocument();

      const grid = statsSection?.querySelector(".grid");
      expect(grid).toHaveClass(
        "grid-cols-2",
        "sm:grid-cols-2",
        "md:grid-cols-4"
      );
    });
  });

  describe("Accessibility", () => {
    it("utilise des éléments sémantiques appropriés", () => {
      expect(screen.getByRole("main")).toBeInTheDocument();
      // Il y a plus de 7 titres de section (fonctionnalités individuelles + sections principales)
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThanOrEqual(7);
    });

    it("affiche les emojis avec des attributs aria-label appropriés", () => {
      const emojiElements = screen.getAllByRole("img", { hidden: true });
      emojiElements.forEach((emoji) => {
        expect(emoji).toHaveAttribute("aria-label");
      });
    });
  });
});
