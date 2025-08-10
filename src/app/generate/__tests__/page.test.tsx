import React from "react";
import { render, screen } from "@testing-library/react";
import GeneratePage from "../page";

// Mock du composant ImageGenerator pour éviter les erreurs de rendu
jest.mock("@/components/ImageGenerator", () => {
  return function MockImageGenerator() {
    return <div data-testid="image-generator">ImageGenerator Component</div>;
  };
});

describe("Page de Génération", () => {
  it("affiche le titre principal de la page de génération", () => {
    render(<GeneratePage />);
    expect(
      screen.getByText("Générez & Imprimez votre image")
    ).toBeInTheDocument();
  });

  it("affiche la description de la page de génération", () => {
    render(<GeneratePage />);
    expect(
      screen.getByText(
        "Décrivez votre vision, laissez l'IA la créer, puis imprimez-la sur vos produits préférés avec Printify."
      )
    ).toBeInTheDocument();
  });

  it("affiche le composant ImageGenerator", () => {
    render(<GeneratePage />);
    expect(screen.getByTestId("image-generator")).toBeInTheDocument();
  });

  it("applique les classes CSS correctes au conteneur principal", () => {
    const { container } = render(<GeneratePage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("min-h-screen");
  });

  it("applique les classes CSS correctes à la section main", () => {
    const { container } = render(<GeneratePage />);
    const mainElement = container.querySelector("main");
    expect(mainElement).toHaveClass(
      "max-w-7xl",
      "mx-auto",
      "px-4",
      "sm:px-6",
      "lg:px-8",
      "py-12"
    );
  });

  it("applique les classes CSS correctes au conteneur du titre", () => {
    const { container } = render(<GeneratePage />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("text-center", "mb-12");
  });

  it("applique les classes CSS correctes au titre", () => {
    const { container } = render(<GeneratePage />);
    const title = container.querySelector("h1");
    expect(title).toHaveClass("text-4xl", "font-bold", "text-gray-900", "mb-4");
  });

  it("applique les classes CSS correctes à la description", () => {
    const { container } = render(<GeneratePage />);
    const description = container.querySelector("p");
    expect(description).toHaveClass("text-lg", "text-gray-600");
  });

  it("affiche le titre avec la bonne hiérarchie", () => {
    render(<GeneratePage />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Générez & Imprimez votre image");
  });

  it("affiche le contenu dans le bon ordre", () => {
    const { container } = render(<GeneratePage />);
    const main = container.querySelector("main");
    const children = main?.children;

    if (children) {
      expect(children[0]).toHaveClass("text-center", "mb-12");
      expect(children[1]).toHaveAttribute("data-testid", "image-generator");
    }
  });

  it("affiche le titre et la description centrés", () => {
    const { container } = render(<GeneratePage />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("text-center");
  });

  it("affiche la description avec la bonne marge", () => {
    const { container } = render(<GeneratePage />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("mb-12");
  });

  it("affiche le texte avec les bonnes apostrophes", () => {
    render(<GeneratePage />);
    expect(screen.getByText(/l'IA la créer/)).toBeInTheDocument();
  });
});
