import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock des composants pour éviter les erreurs de rendu
jest.mock("@/components/CreateImage", () => {
  return function MockCreateImage() {
    return <div data-testid="create-image">CreateImage Component</div>;
  };
});

jest.mock("@/components/Cta", () => {
  return function MockCta() {
    return <div data-testid="cta">Cta Component</div>;
  };
});

jest.mock("@/components/GridImages", () => {
  return function MockGridImages() {
    return <div data-testid="grid-images">GridImages Component</div>;
  };
});

jest.mock("@/components/HowItWorks", () => {
  return function MockHowItWorks() {
    return <div data-testid="how-it-works">HowItWorks Component</div>;
  };
});

jest.mock("@/components/Testimonials", () => {
  return function MockTestimonials() {
    return <div data-testid="testimonials">Testimonials Component</div>;
  };
});

// Mock de Next.js Link pour éviter les erreurs de rendu
jest.mock("next/link", () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
});

describe("Page d'accueil", () => {
  it("affiche le titre principal avec le bon texte", () => {
    render(<Home />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Transformez vos idées en");
    expect(title).toHaveTextContent("images");
    expect(title).toHaveTextContent("& objets imprimés.");
  });

  it("affiche la description principale", () => {
    render(<Home />);
    expect(
      screen.getByText(
        "Créez des visuels uniques avec l'IA, puis imprimez-les sur de vrais produits avec Printify – de l'imagination à la réalité en quelques clics."
      )
    ).toBeInTheDocument();
  });

  it("affiche le bouton de génération d'image avec le bon texte", () => {
    render(<Home />);
    expect(screen.getByText("Générer une image")).toBeInTheDocument();
  });

  it("affiche le bouton de génération avec l'emoji", () => {
    render(<Home />);
    const button = screen.getByText("Générer une image");
    expect(button.parentElement).toHaveTextContent("✨");
  });

  it("affiche le lien de génération avec la bonne destination", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /générer une image/i });
    expect(link).toHaveAttribute("href", "/generate");
  });

  it("applique les classes CSS correctes au bouton de génération", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /générer une image/i });
    expect(link).toHaveClass(
      "bg-black",
      "text-white",
      "px-6",
      "py-3",
      "rounded-full",
      "hover:bg-gray-800",
      "inline-flex",
      "items-center"
    );
  });

  it("applique les classes CSS correctes au conteneur principal", () => {
    const { container } = render(<Home />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("min-h-screen");
  });

  it("applique les classes CSS correctes à la section main", () => {
    const { container } = render(<Home />);
    const mainElement = container.querySelector("main");
    expect(mainElement).toHaveClass(
      "max-w-4xl",
      "mx-auto",
      "px-4",
      "py-16",
      "text-center"
    );
  });

  it("affiche tous les composants requis", () => {
    render(<Home />);
    expect(screen.getByTestId("grid-images")).toBeInTheDocument();
    expect(screen.getByTestId("how-it-works")).toBeInTheDocument();
    expect(screen.getByTestId("create-image")).toBeInTheDocument();
    expect(screen.getByTestId("testimonials")).toBeInTheDocument();
    expect(screen.getByTestId("cta")).toBeInTheDocument();
  });

  it("affiche le titre avec la bonne hiérarchie", () => {
    render(<Home />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("text-5xl", "font-bold", "mb-4");
  });

  it("affiche le span du mot 'images' avec la bonne couleur", () => {
    render(<Home />);
    const imagesSpan = screen.getByText("images");
    expect(imagesSpan).toHaveClass("text-blue-500");
  });

  it("affiche la description avec les bonnes classes CSS", () => {
    render(<Home />);
    const description = screen.getByText(
      "Créez des visuels uniques avec l'IA, puis imprimez-les sur de vrais produits avec Printify – de l'imagination à la réalité en quelques clics."
    );
    expect(description).toHaveClass("text-gray-600", "text-lg", "mb-8");
  });

  it("affiche le conteneur du titre avec la bonne marge", () => {
    const { container } = render(<Home />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("mb-8");
  });

  it("affiche le bouton avec l'emoji dans le bon ordre", () => {
    render(<Home />);
    const button = screen.getByRole("link", { name: /générer une image/i });
    const emoji = button.querySelector("span");
    expect(emoji).toHaveClass("ml-2");
    expect(emoji).toHaveTextContent("✨");
  });
});
