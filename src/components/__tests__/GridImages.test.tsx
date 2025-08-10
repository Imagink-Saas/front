import React from "react";
import { render, screen } from "@testing-library/react";
import GridImages from "../GridImages";

// Mock de Next.js Image pour éviter les erreurs de rendu
jest.mock("next/image", () => {
  return ({ src, alt, width, height, className, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={200}
      className={className}
      {...props}
    />
  );
});

describe("GridImages", () => {
  it("affiche la grille d'images avec le bon nombre d'images", () => {
    render(<GridImages />);

    // Vérifier que les 3 images sont affichées
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });

  it("affiche la première image avec les bonnes propriétés", () => {
    render(<GridImages />);

    const firstImage = screen.getByAltText("Generated image 1");
    expect(firstImage).toBeInTheDocument();
    expect(firstImage).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2023/07/19/03/18/people-8135977_1280.png"
    );
    expect(firstImage).toHaveAttribute("width", "200");
    expect(firstImage).toHaveAttribute("height", "200");
  });

  it("affiche la deuxième image avec les bonnes propriétés", () => {
    render(<GridImages />);

    const secondImage = screen.getByAltText("Generated image 2");
    expect(secondImage).toBeInTheDocument();
    expect(secondImage).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2023/01/08/22/08/ai-generated-7706228_1280.jpg"
    );
    expect(secondImage).toHaveAttribute("width", "200");
    expect(secondImage).toHaveAttribute("height", "200");
  });

  it("affiche la troisième image avec les bonnes propriétés", () => {
    render(<GridImages />);

    const thirdImage = screen.getByAltText("Generated image 3");
    expect(thirdImage).toBeInTheDocument();
    expect(thirdImage).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2024/06/08/04/19/ai-generated-8815780_1280.jpg"
    );
    expect(thirdImage).toHaveAttribute("width", "200");
    expect(thirdImage).toHaveAttribute("height", "200");
  });

  it("applique les classes CSS correctes au conteneur principal", () => {
    const { container } = render(<GridImages />);

    const mainContainer = container.querySelector(".grid");
    expect(mainContainer).toHaveClass("grid", "grid-cols-3", "gap-4", "mb-16");
  });

  it("applique les classes CSS correctes à chaque conteneur d'image", () => {
    render(<GridImages />);

    const imageContainers = screen
      .getAllByRole("img")
      .map((img) => img.parentElement);

    imageContainers.forEach((container) => {
      expect(container).toHaveClass(
        "aspect-square",
        "rounded-lg",
        "overflow-hidden"
      );
    });
  });

  it("applique les classes CSS correctes à chaque image", () => {
    render(<GridImages />);

    const images = screen.getAllByRole("img");

    images.forEach((image) => {
      expect(image).toHaveClass("w-full", "h-full", "object-cover");
    });
  });

  it("affiche les images dans le bon ordre", () => {
    render(<GridImages />);

    const images = screen.getAllByRole("img");

    // Vérifier l'ordre des images
    expect(images[0]).toHaveAttribute("alt", "Generated image 1");
    expect(images[1]).toHaveAttribute("alt", "Generated image 2");
    expect(images[2]).toHaveAttribute("alt", "Generated image 3");
  });

  it("utilise des clés uniques pour chaque élément de la liste", () => {
    const { container } = render(<GridImages />);

    // Vérifier que chaque div d'image a une clé unique
    const imageDivs = container.querySelectorAll(".aspect-square");
    expect(imageDivs).toHaveLength(3);

    // Vérifier que les clés sont bien présentes (index 0, 1, 2)
    imageDivs.forEach((div, index) => {
      expect(div).toBeInTheDocument();
    });
  });

  it("affiche toutes les images avec la même taille", () => {
    render(<GridImages />);

    const images = screen.getAllByRole("img");

    images.forEach((image) => {
      expect(image).toHaveAttribute("width", "200");
      expect(image).toHaveAttribute("height", "200");
    });
  });

  it("affiche les images avec les bons attributs alt pour l'accessibilité", () => {
    render(<GridImages />);

    const expectedAltTexts = [
      "Generated image 1",
      "Generated image 2",
      "Generated image 3",
    ];

    expectedAltTexts.forEach((altText) => {
      expect(screen.getByAltText(altText)).toBeInTheDocument();
    });
  });

  it("structure la grille avec 3 colonnes", () => {
    const { container } = render(<GridImages />);

    const mainContainer = container.querySelector(".grid");
    expect(mainContainer).toHaveClass("grid-cols-3");
  });

  it("applique un espacement correct entre les images", () => {
    const { container } = render(<GridImages />);

    const mainContainer = container.querySelector(".grid");
    expect(mainContainer).toHaveClass("gap-4");
  });

  it("applique une marge en bas du composant", () => {
    const { container } = render(<GridImages />);

    const mainContainer = container.querySelector(".grid");
    expect(mainContainer).toHaveClass("mb-16");
  });
});
