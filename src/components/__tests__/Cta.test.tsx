import React from "react";
import { render, screen } from "@testing-library/react";
import Cta from "../Cta";

// Mock de Next.js Link pour éviter les erreurs de rendu
jest.mock("next/link", () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
});

describe("Cta", () => {
  it("affiche le titre principal", () => {
    render(<Cta />);
    expect(
      screen.getByText("Essayez la magie. Lancez-vous !")
    ).toBeInTheDocument();
  });

  it("affiche le bouton d'action avec le bon texte", () => {
    render(<Cta />);
    expect(screen.getByText("Générer une image")).toBeInTheDocument();
  });

  it("affiche l'icône étoile dans le bouton", () => {
    render(<Cta />);
    expect(screen.getByText("✨")).toBeInTheDocument();
  });

  it("affiche le lien avec la bonne destination", () => {
    render(<Cta />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/generate");
  });

  it("applique les classes CSS correctes à la section", () => {
    const { container } = render(<Cta />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-16");
  });

  it("applique les classes CSS correctes au titre", () => {
    render(<Cta />);
    const title = screen.getByText("Essayez la magie. Lancez-vous !");
    expect(title).toHaveClass("text-3xl", "font-bold", "mb-8");
  });

  it("applique les classes CSS correctes au bouton", () => {
    render(<Cta />);
    const button = screen.getByRole("link");
    expect(button).toHaveClass(
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

  it("applique les classes CSS correctes à l'icône étoile", () => {
    render(<Cta />);
    const starIcon = screen.getByText("✨");
    expect(starIcon).toHaveClass("ml-2");
  });

  it("structure le composant avec une section et un titre h2", () => {
    const { container } = render(<Cta />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { level: 2 });

    expect(section).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  it("affiche le bouton comme un lien cliquable", () => {
    render(<Cta />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
  });

  it("contient le texte et l'icône dans le bon ordre", () => {
    render(<Cta />);
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("Générer une image");
    expect(link).toHaveTextContent("✨");
  });

  it("utilise la bonne structure sémantique", () => {
    const { container } = render(<Cta />);

    // Vérifier que c'est bien une section
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    // Vérifier que le titre est bien un h2
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();

    // Vérifier que le bouton est bien un lien
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });
});
