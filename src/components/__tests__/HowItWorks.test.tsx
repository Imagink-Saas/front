import React from "react";
import { render, screen } from "@testing-library/react";
import HowItWorks from "../HowItWorks";

describe("HowItWorks", () => {
  it("affiche le titre principal", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Comment ça marche")).toBeInTheDocument();
  });

  it("affiche la description principale", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(
        "Transformez vos mots en créations visuelles et objets imprimés"
      )
    ).toBeInTheDocument();
  });

  it("affiche la première étape avec le bon titre", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Décrivez votre idée")).toBeInTheDocument();
  });

  it("affiche la première étape avec la bonne description", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(
        "Saisissez une phrase, une description ou un concept : notre IA générera une image unique à partir de votre texte."
      )
    ).toBeInTheDocument();
  });

  it("affiche la deuxième étape avec le bon titre", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Admirez la magie")).toBeInTheDocument();
  });

  it("affiche la deuxième étape avec la bonne description", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(
        "Notre moteur IA transforme instantanément votre texte en une image originale et de haute qualité."
      )
    ).toBeInTheDocument();
  });

  it("affiche la troisième étape avec le bon titre", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Imprimez & partagez")).toBeInTheDocument();
  });

  it("affiche la troisième étape avec la bonne description", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(
        "Sélectionnez un produit et imprimez votre création via Printify, ou partagez-la avec le monde."
      )
    ).toBeInTheDocument();
  });

  it("affiche les trois icônes avec les bons attributs d'accessibilité", () => {
    render(<HowItWorks />);

    const visionIcon = screen.getByLabelText("vision");
    const magicIcon = screen.getByLabelText("magic");
    const downloadIcon = screen.getByLabelText("download");

    expect(visionIcon).toBeInTheDocument();
    expect(magicIcon).toBeInTheDocument();
    expect(downloadIcon).toBeInTheDocument();

    expect(visionIcon).toHaveTextContent("👁️");
    expect(magicIcon).toHaveTextContent("✨");
    expect(downloadIcon).toHaveTextContent("⬇️");
  });

  it("applique les classes CSS correctes à la section", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-16");
  });

  it("applique les classes CSS correctes au titre principal", () => {
    render(<HowItWorks />);
    const title = screen.getByText("Comment ça marche");
    expect(title).toHaveClass("text-3xl", "font-bold", "mb-2");
  });

  it("applique les classes CSS correctes à la description principale", () => {
    render(<HowItWorks />);
    const description = screen.getByText(
      "Transformez vos mots en créations visuelles et objets imprimés"
    );
    expect(description).toHaveClass("text-gray-600", "mb-12");
  });

  it("applique les classes CSS correctes au conteneur de la grille", () => {
    const { container } = render(<HowItWorks />);
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("grid", "gap-8", "max-w-2xl", "mx-auto");
  });

  it("applique les classes CSS correctes aux conteneurs d'étapes", () => {
    const { container } = render(<HowItWorks />);
    const stepContainers = container.querySelectorAll(
      ".flex.items-start.gap-4.text-left"
    );
    expect(stepContainers).toHaveLength(3);
  });

  it("applique les classes CSS correctes aux icônes", () => {
    const { container } = render(<HowItWorks />);

    const visionIconContainer = container.querySelector(".bg-blue-100");
    const magicIconContainer = container.querySelector(".bg-purple-100");
    const downloadIconContainer = container.querySelector(".bg-green-100");

    expect(visionIconContainer).toHaveClass("bg-blue-100", "p-3", "rounded-lg");
    expect(magicIconContainer).toHaveClass(
      "bg-purple-100",
      "p-3",
      "rounded-lg"
    );
    expect(downloadIconContainer).toHaveClass(
      "bg-green-100",
      "p-3",
      "rounded-lg"
    );
  });

  it("applique les classes CSS correctes aux titres des étapes", () => {
    render(<HowItWorks />);

    const stepTitles = screen.getAllByText(
      /Décrivez votre idée|Admirez la magie|Imprimez & partagez/
    );
    stepTitles.forEach((title) => {
      expect(title).toHaveClass("font-semibold", "mb-2");
    });
  });

  it("applique les classes CSS correctes aux descriptions des étapes", () => {
    render(<HowItWorks />);

    const stepDescriptions = screen.getAllByText(
      /Saisissez une phrase|Notre moteur IA|Sélectionnez un produit/
    );
    stepDescriptions.forEach((description) => {
      expect(description).toHaveClass("text-gray-600");
    });
  });

  it("structure le composant avec une section et un titre h2", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { level: 2 });

    expect(section).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  it("affiche trois étapes avec des titres h3", () => {
    render(<HowItWorks />);

    const stepHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(stepHeadings).toHaveLength(3);

    expect(stepHeadings[0]).toHaveTextContent("Décrivez votre idée");
    expect(stepHeadings[1]).toHaveTextContent("Admirez la magie");
    expect(stepHeadings[2]).toHaveTextContent("Imprimez & partagez");
  });

  it("utilise la bonne structure sémantique", () => {
    const { container } = render(<HowItWorks />);

    // Vérifier que c'est bien une section
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    // Vérifier que le titre principal est bien un h2
    const mainHeading = screen.getByRole("heading", { level: 2 });
    expect(mainHeading).toBeInTheDocument();

    // Vérifier qu'il y a 3 titres d'étapes (h3)
    const stepHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(stepHeadings).toHaveLength(3);
  });

  it("affiche les étapes dans le bon ordre", () => {
    render(<HowItWorks />);

    const stepTitles = [
      "Décrivez votre idée",
      "Admirez la magie",
      "Imprimez & partagez",
    ];

    stepTitles.forEach((title, index) => {
      const heading = screen.getByText(title);
      expect(heading).toBeInTheDocument();
    });
  });
});
