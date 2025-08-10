import React from "react";
import { render } from "@testing-library/react";
import RootLayout from "../layout";

// Mock des composants pour éviter les erreurs de rendu
jest.mock("@/components/Header", () => {
  return function MockHeader() {
    return <header data-testid="header">Header Component</header>;
  };
});

jest.mock("@/components/Footer", () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer Component</footer>;
  };
});

// Mock de Clerk pour éviter les erreurs d'authentification
jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock du contexte UserCredits
jest.mock("@/context/UserCreditsContext", () => ({
  UserCreditsProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock de react-hot-toast
jest.mock("react-hot-toast", () => ({
  Toaster: ({ position }: { position: string }) => (
    <div data-testid="toaster" data-position={position}>
      Toaster Component
    </div>
  ),
}));

// Mock de next/font/google
jest.mock("next/font/google", () => ({
  Poppins: () => ({
    className: "poppins-font-class",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
  }),
}));

describe("RootLayout", () => {
  it("affiche le composant Header", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Contenu enfant</div>
      </RootLayout>
    );

    expect(getByTestId("header")).toBeInTheDocument();
  });

  it("affiche le composant Footer", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Contenu enfant</div>
      </RootLayout>
    );

    expect(getByTestId("footer")).toBeInTheDocument();
  });

  it("affiche le composant Toaster avec la position correcte", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Contenu enfant</div>
      </RootLayout>
    );

    const toaster = getByTestId("toaster");
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveAttribute("data-position", "bottom-center");
  });

  it("affiche le contenu enfant entre Header et Footer", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="children">Contenu enfant</div>
      </RootLayout>
    );

    expect(getByTestId("children")).toBeInTheDocument();
  });

  it("affiche les composants dans le bon ordre", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="children">Contenu enfant</div>
      </RootLayout>
    );

    const body = container.querySelector("body");
    const children = body?.children;

    if (children) {
      expect(children[0]).toHaveAttribute("data-testid", "header");
      expect(children[1]).toHaveAttribute("data-testid", "toaster");
      expect(children[2]).toHaveAttribute("data-testid", "children");
      expect(children[3]).toHaveAttribute("data-testid", "footer");
    }
  });

  it("rend correctement avec des enfants complexes", () => {
    const complexChildren = (
      <div>
        <h1>Titre</h1>
        <p>Paragraphe</p>
        <button>Bouton</button>
      </div>
    );

    // Vérifier que le rendu fonctionne sans erreur
    expect(() => {
      render(<RootLayout>{complexChildren}</RootLayout>);
    }).not.toThrow();
  });

  it("rend correctement sans enfants", () => {
    // Vérifier que le rendu fonctionne sans erreur
    expect(() => {
      render(<RootLayout>{null}</RootLayout>);
    }).not.toThrow();
  });

  it("rend correctement avec des enfants vides", () => {
    // Vérifier que le rendu fonctionne sans erreur
    expect(() => {
      render(<RootLayout>{}</RootLayout>);
    }).not.toThrow();
  });
});
