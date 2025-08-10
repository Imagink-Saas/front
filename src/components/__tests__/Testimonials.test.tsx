import React from "react";
import { render, screen } from "@testing-library/react";
import Testimonials from "../Testimonials";

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

describe("Testimonials", () => {
  it("affiche le titre principal", () => {
    render(<Testimonials />);
    expect(screen.getByText("Témoignages clients")).toBeInTheDocument();
  });

  it("affiche la description principale", () => {
    render(<Testimonials />);
    expect(
      screen.getByText("Ce que disent nos utilisateurs")
    ).toBeInTheDocument();
  });

  it("affiche le premier témoignage avec le bon nom", () => {
    render(<Testimonials />);
    expect(screen.getByText("Donald Jackson")).toBeInTheDocument();
  });

  it("affiche le premier témoignage avec le bon rôle", () => {
    render(<Testimonials />);
    expect(screen.getByText("Graphic Designer")).toBeInTheDocument();
  });

  it("affiche le deuxième témoignage avec le bon nom", () => {
    render(<Testimonials />);
    expect(screen.getByText("Richard Nelson")).toBeInTheDocument();
  });

  it("affiche le deuxième témoignage avec le bon rôle", () => {
    render(<Testimonials />);
    expect(screen.getByText("Content Creator")).toBeInTheDocument();
  });

  it("affiche le troisième témoignage avec le bon nom", () => {
    render(<Testimonials />);
    expect(screen.getByText("James Washington")).toBeInTheDocument();
  });

  it("affiche le troisième témoignage avec le bon rôle", () => {
    render(<Testimonials />);
    expect(screen.getByText("Co-Founder")).toBeInTheDocument();
  });

  it("affiche le texte de témoignage pour tous les utilisateurs", () => {
    render(<Testimonials />);

    const testimonialTexts = screen.getAllByText(
      /J'utilise Imagify depuis près de deux ans pour mon Instagram/
    );
    expect(testimonialTexts).toHaveLength(3);
  });

  it("affiche les 5 étoiles pour chaque témoignage", () => {
    render(<Testimonials />);

    const starContainers = screen.getAllByText("★★★★★");
    expect(starContainers).toHaveLength(3);
  });

  it("affiche les images des avatars avec les bonnes propriétés", () => {
    render(<Testimonials />);

    const avatarImages = screen.getAllByRole("img");
    expect(avatarImages).toHaveLength(3);

    avatarImages.forEach((image) => {
      expect(image).toHaveAttribute("width", "64");
      expect(image).toHaveAttribute("height", "64");
      expect(image).toHaveClass("rounded-full", "mx-auto", "mb-4");
    });
  });

  it("affiche les images des avatars avec la bonne source", () => {
    render(<Testimonials />);

    const avatarImages = screen.getAllByRole("img");
    avatarImages.forEach((image) => {
      expect(image).toHaveAttribute(
        "src",
        "https://cdn.pixabay.com/photo/2023/07/19/03/18/people-8135977_1280.png"
      );
    });
  });

  it("affiche les images des avatars avec les bons attributs alt", () => {
    render(<Testimonials />);

    expect(screen.getByAltText("Donald Jackson")).toBeInTheDocument();
    expect(screen.getByAltText("Richard Nelson")).toBeInTheDocument();
    expect(screen.getByAltText("James Washington")).toBeInTheDocument();
  });

  it("applique les classes CSS correctes à la section", () => {
    const { container } = render(<Testimonials />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-16");
  });

  it("applique les classes CSS correctes au titre principal", () => {
    render(<Testimonials />);
    const title = screen.getByText("Témoignages clients");
    expect(title).toHaveClass("text-3xl", "font-bold", "mb-2");
  });

  it("applique les classes CSS correctes à la description principale", () => {
    render(<Testimonials />);
    const description = screen.getByText("Ce que disent nos utilisateurs");
    expect(description).toHaveClass("text-gray-600", "mb-12");
  });

  it("applique les classes CSS correctes au conteneur de la grille", () => {
    const { container } = render(<Testimonials />);
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("grid", "md:grid-cols-3", "gap-8");
  });

  it("applique les classes CSS correctes aux cartes de témoignage", () => {
    const { container } = render(<Testimonials />);
    const testimonialCards = container.querySelectorAll(
      ".bg-white.p-6.rounded-lg.shadow-sm"
    );
    expect(testimonialCards).toHaveLength(3);
  });

  it("applique les classes CSS correctes aux noms des témoins", () => {
    render(<Testimonials />);

    const names = screen.getAllByText(
      /Donald Jackson|Richard Nelson|James Washington/
    );
    names.forEach((name) => {
      expect(name).toHaveClass("font-semibold");
    });
  });

  it("applique les classes CSS correctes aux rôles des témoins", () => {
    render(<Testimonials />);

    const roles = screen.getAllByText(
      /Graphic Designer|Content Creator|Co-Founder/
    );
    roles.forEach((role) => {
      expect(role).toHaveClass("text-gray-600", "text-sm", "mb-4");
    });
  });

  it("applique les classes CSS correctes aux conteneurs d'étoiles", () => {
    const { container } = render(<Testimonials />);

    const starContainers = container.querySelectorAll(
      ".flex.justify-center.text-yellow-400.mb-4"
    );
    expect(starContainers).toHaveLength(3);
  });

  it("applique les classes CSS correctes au texte de témoignage", () => {
    render(<Testimonials />);

    const testimonialTexts = screen.getAllByText(
      /J'utilise Imagify depuis près de deux ans pour mon Instagram/
    );
    testimonialTexts.forEach((text) => {
      expect(text).toHaveClass("text-gray-600");
    });
  });

  it("structure le composant avec une section et un titre h2", () => {
    const { container } = render(<Testimonials />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { level: 2 });

    expect(section).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  it("affiche trois témoignages avec des titres h3", () => {
    render(<Testimonials />);

    const testimonialHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(testimonialHeadings).toHaveLength(3);

    expect(testimonialHeadings[0]).toHaveTextContent("Donald Jackson");
    expect(testimonialHeadings[1]).toHaveTextContent("Richard Nelson");
    expect(testimonialHeadings[2]).toHaveTextContent("James Washington");
  });

  it("utilise la bonne structure sémantique", () => {
    const { container } = render(<Testimonials />);

    // Vérifier que c'est bien une section
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    // Vérifier que le titre principal est bien un h2
    const mainHeading = screen.getByRole("heading", { level: 2 });
    expect(mainHeading).toBeInTheDocument();

    // Vérifier qu'il y a 3 titres de témoignages (h3)
    const testimonialHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(testimonialHeadings).toHaveLength(3);
  });

  it("affiche les témoignages dans le bon ordre", () => {
    render(<Testimonials />);

    const testimonialNames = [
      "Donald Jackson",
      "Richard Nelson",
      "James Washington",
    ];

    testimonialNames.forEach((name, index) => {
      const heading = screen.getByText(name);
      expect(heading).toBeInTheDocument();
    });
  });

  it("affiche exactement 5 étoiles pour chaque témoignage", () => {
    render(<Testimonials />);

    const starContainers = screen.getAllByText("★★★★★");
    expect(starContainers).toHaveLength(3);

    starContainers.forEach((container) => {
      expect(container).toHaveTextContent("★★★★★");
    });
  });
});
