import React from "react";
import { render, screen } from "@testing-library/react";
import SignInPage from "../page";

// Mock du composant SignIn de Clerk pour éviter les erreurs de rendu
jest.mock("@clerk/nextjs", () => ({
  SignIn: () => <div data-testid="sign-in">SignIn Component</div>,
}));

describe("Page de Connexion", () => {
  it("affiche le composant SignIn", () => {
    render(<SignInPage />);
    expect(screen.getByTestId("sign-in")).toBeInTheDocument();
  });

  it("applique les classes CSS correctes au conteneur principal", () => {
    const { container } = render(<SignInPage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass(
      "flex",
      "justify-center",
      "items-center",
      "h-[calc(100vh-10rem)]"
    );
  });

  it("centre le composant SignIn horizontalement", () => {
    const { container } = render(<SignInPage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("justify-center");
  });

  it("centre le composant SignIn verticalement", () => {
    const { container } = render(<SignInPage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("items-center");
  });

  it("applique la hauteur calculée correcte", () => {
    const { container } = render(<SignInPage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("h-[calc(100vh-10rem)]");
  });

  it("utilise flexbox pour le centrage", () => {
    const { container } = render(<SignInPage />);
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toHaveClass("flex");
  });

  it("rend correctement sans props", () => {
    expect(() => {
      render(<SignInPage />);
    }).not.toThrow();
  });

  it("affiche le composant SignIn au centre de l'écran", () => {
    const { container } = render(<SignInPage />);
    const mainContainer = container.querySelector("div");

    // Vérifier que toutes les classes de centrage sont présentes
    expect(mainContainer).toHaveClass("flex", "justify-center", "items-center");
  });
});
