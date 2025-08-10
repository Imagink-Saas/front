import React from "react";
import { render, screen } from "@testing-library/react";
import CreateImage from "../CreateImage";

// Mock de Next.js Image pour éviter les erreurs de rendu
jest.mock("next/image", () => {
  return ({ src, alt, width, height, className, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
});

describe("CreateImage", () => {
  it("affiche le titre principal", () => {
    render(<CreateImage />);
    expect(screen.getByText("Créez des images IA")).toBeInTheDocument();
  });

  it("affiche la description principale", () => {
    render(<CreateImage />);
    expect(
      screen.getByText("Transformez votre imagination en visuels")
    ).toBeInTheDocument();
  });

  it("affiche le sous-titre", () => {
    render(<CreateImage />);
    expect(
      screen.getByText("Découvrez le générateur d'images IA à partir de texte")
    ).toBeInTheDocument();
  });

  it("affiche l'image de démonstration", () => {
    render(<CreateImage />);
    const image = screen.getByAltText("AI Image Generation Demo");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2023/07/19/03/18/people-8135977_1280.png"
    );
  });

  it("affiche la première description du générateur", () => {
    render(<CreateImage />);
    expect(
      screen.getByText(
        "Donnez vie à vos idées avec notre générateur d'images IA gratuit. Que vous ayez besoin de visuels époustouflants ou d'illustrations uniques, notre outil transforme votre texte en images en quelques clics."
      )
    ).toBeInTheDocument();
  });

  it("affiche la deuxième description du générateur", () => {
    render(<CreateImage />);
    expect(
      screen.getByText(
        "Saisissez simplement une description, et notre IA de pointe générera des images de haute qualité en quelques secondes. Du concept à la réalité, les possibilités créatives sont infinies !"
      )
    ).toBeInTheDocument();
  });

  it("applique les classes CSS correctes au titre principal", () => {
    render(<CreateImage />);
    const title = screen.getByText("Créez des images IA");
    expect(title).toHaveClass("text-3xl", "font-bold", "mb-2");
  });

  it("applique les classes CSS correctes à la description principale", () => {
    render(<CreateImage />);
    const description = screen.getByText(
      "Transformez votre imagination en visuels"
    );
    expect(description).toHaveClass("text-gray-600", "mb-12");
  });

  it("applique les classes CSS correctes au sous-titre", () => {
    render(<CreateImage />);
    const subtitle = screen.getByText(
      "Découvrez le générateur d'images IA à partir de texte"
    );
    expect(subtitle).toHaveClass("text-2xl", "font-bold", "mb-4");
  });

  it("applique les classes CSS correctes aux descriptions", () => {
    render(<CreateImage />);
    const descriptions = screen.getAllByText(
      /Donnez vie à vos idées|Saisissez simplement une description/
    );
    descriptions.forEach((description) => {
      expect(description).toHaveClass("text-gray-600");
    });
  });

  it("applique les classes CSS correctes à l'image", () => {
    render(<CreateImage />);
    const image = screen.getByAltText("AI Image Generation Demo");
    expect(image).toHaveClass("w-full");
  });

  it("affiche l'image avec les bonnes dimensions", () => {
    render(<CreateImage />);
    const image = screen.getByAltText("AI Image Generation Demo");
    expect(image).toHaveAttribute("width", "500");
    expect(image).toHaveAttribute("height", "500");
  });

  it("affiche le contenu dans une grille responsive", () => {
    render(<CreateImage />);
    const grid = screen
      .getByText("Créez des images IA")
      .closest("section")
      ?.querySelector(".grid");
    expect(grid).toHaveClass("grid", "md:grid-cols-2", "gap-8", "items-center");
  });

  it("affiche l'image dans un conteneur avec overflow hidden", () => {
    render(<CreateImage />);
    const imageContainer = screen
      .getByAltText("AI Image Generation Demo")
      .closest("div");
    expect(imageContainer).toHaveClass("rounded-lg", "overflow-hidden");
  });

  it("affiche le texte dans un conteneur aligné à gauche", () => {
    render(<CreateImage />);
    const textContainer = screen
      .getByText("Découvrez le générateur d'images IA à partir de texte")
      .closest("div");
    expect(textContainer).toHaveClass("text-left");
  });
});
