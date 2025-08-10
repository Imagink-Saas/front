import React from "react";
import { render, screen } from "@testing-library/react";
import GalleryPage from "../page";

// Mock du composant SavedImages pour éviter les erreurs de rendu
jest.mock("@/components/SavedImages", () => {
  return function MockSavedImages() {
    return <div data-testid="saved-images">SavedImages Component</div>;
  };
});

describe("Page Galerie", () => {
  it("affiche le titre principal de la galerie", () => {
    render(<GalleryPage />);
    expect(screen.getByText("Galerie d'images")).toBeInTheDocument();
  });

  it("affiche la description de la galerie", () => {
    render(<GalleryPage />);
    expect(
      screen.getByText("Visualisez et gérez toutes vos images sauvegardées")
    ).toBeInTheDocument();
  });

  it("affiche le composant SavedImages", () => {
    render(<GalleryPage />);
    expect(screen.getByTestId("saved-images")).toBeInTheDocument();
  });

  it("applique les classes CSS correctes au conteneur principal", () => {
    const { container } = render(<GalleryPage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("min-h-screen");
  });

  it("applique les classes CSS correctes à la section main", () => {
    const { container } = render(<GalleryPage />);
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
    const { container } = render(<GalleryPage />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("text-center", "mb-12");
  });

  it("applique les classes CSS correctes au titre", () => {
    const { container } = render(<GalleryPage />);
    const title = container.querySelector("h1");
    expect(title).toHaveClass("text-4xl", "font-bold", "text-gray-900", "mb-4");
  });

  it("applique les classes CSS correctes à la description", () => {
    const { container } = render(<GalleryPage />);
    const description = container.querySelector("p");
    expect(description).toHaveClass("text-lg", "text-gray-600");
  });

  it("affiche le titre avec la bonne hiérarchie", () => {
    render(<GalleryPage />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Galerie d'images");
  });

  it("affiche le contenu dans le bon ordre", () => {
    const { container } = render(<GalleryPage />);
    const main = container.querySelector("main");
    const children = main?.children;

    if (children) {
      expect(children[0]).toHaveClass("text-center", "mb-12");
      expect(children[1]).toHaveAttribute("data-testid", "saved-images");
    }
  });

  it("affiche le titre et la description centrés", () => {
    const { container } = render(<GalleryPage />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("text-center");
  });

  it("affiche la description avec la bonne marge", () => {
    const { container } = render(<GalleryPage />);
    const titleContainer = container.querySelector("div");
    const titleDiv = titleContainer?.querySelector("div");
    expect(titleDiv).toHaveClass("mb-12");
  });
});
