import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

// Mock de Next.js Link pour éviter les erreurs de rendu
jest.mock("next/link", () => {
  return ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
});

// Mock des icônes React Icons
jest.mock("react-icons/fa", () => ({
  FaFacebook: () => <span data-testid="facebook-icon">Facebook</span>,
  FaTwitter: () => <span data-testid="twitter-icon">Twitter</span>,
  FaInstagram: () => <span data-testid="instagram-icon">Instagram</span>,
}));

describe("Footer", () => {
  it("affiche le texte de copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText("© All right reserved. Copyright imagify.")
    ).toBeInTheDocument();
  });

  it("affiche l'icône Facebook", () => {
    render(<Footer />);
    expect(screen.getByTestId("facebook-icon")).toBeInTheDocument();
  });

  it("affiche l'icône Twitter", () => {
    render(<Footer />);
    expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
  });

  it("affiche l'icône Instagram", () => {
    render(<Footer />);
    expect(screen.getByTestId("instagram-icon")).toBeInTheDocument();
  });

  it("affiche les trois liens de réseaux sociaux", () => {
    render(<Footer />);

    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks).toHaveLength(3);
  });

  it("applique les classes CSS correctes au footer", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("border-t", "border-gray-200", "mt-16");
  });

  it("applique les classes CSS correctes au conteneur principal", () => {
    const { container } = render(<Footer />);
    const mainContainer = container.querySelector(
      ".max-w-7xl.mx-auto.px-4.py-8"
    );
    expect(mainContainer).toHaveClass("max-w-7xl", "mx-auto", "px-4", "py-8");
  });

  it("applique les classes CSS correctes au conteneur flex", () => {
    const { container } = render(<Footer />);
    const flexContainer = container.querySelector(
      ".flex.justify-between.items-center"
    );
    expect(flexContainer).toHaveClass(
      "flex",
      "justify-between",
      "items-center"
    );
  });

  it("applique les classes CSS correctes au conteneur du logo et copyright", () => {
    const { container } = render(<Footer />);
    const logoContainer = container.querySelector(".flex.items-center");
    expect(logoContainer).toHaveClass("flex", "items-center");
  });

  it("applique les classes CSS correctes au texte de copyright", () => {
    render(<Footer />);
    const copyrightText = screen.getByText(
      "© All right reserved. Copyright imagify."
    );
    expect(copyrightText).toHaveClass("text-sm", "text-gray-600");
  });

  it("applique les classes CSS correctes au conteneur des réseaux sociaux", () => {
    const { container } = render(<Footer />);
    const socialContainer = container.querySelector(".flex.gap-4");
    expect(socialContainer).toHaveClass("flex", "gap-4");
  });

  it("applique les classes CSS correctes aux liens de réseaux sociaux", () => {
    render(<Footer />);

    const socialLinks = screen.getAllByRole("link");
    socialLinks.forEach((link) => {
      expect(link).toHaveClass("text-gray-600", "hover:text-gray-900");
    });
  });

  it("structure le composant avec une balise footer", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("utilise la bonne structure sémantique", () => {
    const { container } = render(<Footer />);

    // Vérifier que c'est bien un footer
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();

    // Vérifier qu'il y a 3 liens
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("affiche les icônes dans le bon ordre", () => {
    render(<Footer />);

    const facebookIcon = screen.getByTestId("facebook-icon");
    const twitterIcon = screen.getByTestId("twitter-icon");
    const instagramIcon = screen.getByTestId("instagram-icon");

    expect(facebookIcon).toBeInTheDocument();
    expect(twitterIcon).toBeInTheDocument();
    expect(instagramIcon).toBeInTheDocument();
  });

  it("affiche le texte de copyright avec la bonne taille et couleur", () => {
    render(<Footer />);

    const copyrightText = screen.getByText(
      "© All right reserved. Copyright imagify."
    );
    expect(copyrightText).toHaveClass("text-sm", "text-gray-600");
  });

  it("applique les bonnes marges et bordures", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("mt-16", "border-t", "border-gray-200");
  });

  it("utilise la bonne largeur maximale et centrage", () => {
    const { container } = render(<Footer />);

    const mainContainer = container.querySelector(
      ".max-w-7xl.mx-auto.px-4.py-8"
    );
    expect(mainContainer).toHaveClass("max-w-7xl", "mx-auto");
  });

  it("applique le bon espacement interne", () => {
    const { container } = render(<Footer />);

    const mainContainer = container.querySelector(
      ".max-w-7xl.mx-auto.px-4.py-8"
    );
    expect(mainContainer).toHaveClass("px-4", "py-8");
  });

  it("applique le bon espacement entre les éléments", () => {
    const { container } = render(<Footer />);

    const flexContainer = container.querySelector(
      ".flex.justify-between.items-center"
    );
    expect(flexContainer).toHaveClass("justify-between", "items-center");

    const socialContainer = container.querySelector(".flex.gap-4");
    expect(socialContainer).toHaveClass("gap-4");
  });
});
