import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination, { usePagination } from "../Pagination";

// Composant de test pour tester le hook usePagination
function TestHookComponent({
  items,
  itemsPerPage,
}: {
  items: Array<{ id: number; name: string }>;
  itemsPerPage: number;
}) {
  const pagination = usePagination(items, itemsPerPage);

  return (
    <div>
      <div data-testid="current-page">{pagination.currentPage}</div>
      <div data-testid="total-pages">{pagination.totalPages}</div>
      <div data-testid="total-items">{pagination.totalItems}</div>
      <div data-testid="has-next">{pagination.hasNextPage.toString()}</div>
      <div data-testid="has-prev">{pagination.hasPrevPage.toString()}</div>
      <div data-testid="current-items-count">
        {pagination.currentItems.length}
      </div>

      <button onClick={() => pagination.goToPage(2)} data-testid="go-to-page-2">
        Aller à la page 2
      </button>
      <button onClick={pagination.nextPage} data-testid="next-page">
        Page suivante
      </button>
      <button onClick={pagination.prevPage} data-testid="prev-page">
        Page précédente
      </button>
    </div>
  );
}

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("ne s'affiche pas quand il n'y a qu'une seule page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("s'affiche correctement avec plusieurs pages", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("affiche les informations de page quand showInfo est true", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          showInfo={true}
          totalItems={50}
          itemsPerPage={10}
        />
      );

      expect(screen.getByTestId("page-info")).toBeInTheDocument();
      expect(
        screen.getByText("Affichage de 11 à 20 sur 50 résultats")
      ).toBeInTheDocument();
    });

    it("affiche le singulier pour un seul résultat", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
          showInfo={true}
          totalItems={1}
          itemsPerPage={10}
        />
      );

      expect(
        screen.getByText("Affichage de 1 à 1 sur 1 résultat")
      ).toBeInTheDocument();
    });
  });

  describe("Navigation des pages", () => {
    it("appelle onPageChange quand on clique sur un numéro de page", async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const page3Button = screen.getByText("3");
      await user.click(page3Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it("appelle onPageChange avec la page précédente", async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByLabelText("Page précédente");
      await user.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it("appelle onPageChange avec la page suivante", async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByTestId("next-page");
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it("désactive le bouton précédent sur la première page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByLabelText("Page précédente");
      expect(prevButton).toBeDisabled();
    });

    it("désactive le bouton suivant sur la dernière page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByTestId("next-page");
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Affichage des pages visibles", () => {
    it("affiche toutes les pages quand il y en a peu (≤ 7)", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("affiche les ellipses au début quand on est proche du début", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("affiche les ellipses à la fin quand on est proche de la fin", () => {
      render(
        <Pagination
          currentPage={8}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("9")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("affiche les ellipses au milieu quand on est au centre", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getAllByText("...")).toHaveLength(2);
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("Accessibilité", () => {
    it("a des labels appropriés pour les boutons", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByLabelText("Page précédente")).toBeInTheDocument();
      expect(screen.getByLabelText("Page suivante")).toBeInTheDocument();
      expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Page 3")).toBeInTheDocument();
    });

    it("marque la page courante comme active", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByText("3");
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });

    it("n'a pas d'attribut aria-current sur les autres pages", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const otherPageButton = screen.getByText("1");
      expect(otherPageButton).not.toHaveAttribute("aria-current");
    });
  });

  describe("Responsive design", () => {
    it("affiche le texte 'Précédent' et 'Suivant' sur les écrans larges", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("Précédent")).toBeInTheDocument();
      expect(screen.getByText("Suivant")).toBeInTheDocument();
    });

    it("cache le texte sur les petits écrans (classes CSS)", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByLabelText("Page précédente");
      const nextButton = screen.getByTestId("next-page");

      expect(prevButton.querySelector("span")).toHaveClass("hidden sm:inline");
      expect(nextButton.querySelector("span")).toHaveClass("hidden sm:inline");
    });
  });
});

describe("usePagination Hook", () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calcule correctement le nombre total de pages", () => {
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    expect(screen.getByTestId("total-pages")).toHaveTextContent("3");
    expect(screen.getByTestId("total-items")).toHaveTextContent("25");
  });

  it("retourne les bons éléments pour la page courante", () => {
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    expect(screen.getByTestId("current-items-count")).toHaveTextContent("10");
  });

  it("commence à la page 1 par défaut", () => {
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("permet de naviguer vers une page spécifique", async () => {
    const user = userEvent.setup();
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    const goToPage2Button = screen.getByTestId("go-to-page-2");
    await user.click(goToPage2Button);

    expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    expect(screen.getByTestId("current-items-count")).toHaveTextContent("10");
  });

  it("permet d'aller à la page suivante", async () => {
    const user = userEvent.setup();
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    const nextButton = screen.getByTestId("next-page");
    await user.click(nextButton);

    expect(screen.getByTestId("current-page")).toHaveTextContent("2");
  });

  it("permet d'aller à la page précédente", async () => {
    const user = userEvent.setup();
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    // D'abord aller à la page 2
    const goToPage2Button = screen.getByTestId("go-to-page-2");
    await user.click(goToPage2Button);

    // Puis revenir à la page 1
    const prevButton = screen.getByTestId("prev-page");
    await user.click(prevButton);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("indique correctement s'il y a une page suivante", () => {
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    expect(screen.getByTestId("has-next")).toHaveTextContent("true");
  });

  it("indique correctement s'il y a une page précédente", () => {
    render(<TestHookComponent items={mockItems} itemsPerPage={10} />);

    expect(screen.getByTestId("has-prev")).toHaveTextContent("false");
  });

  it("réinitialise à la page 1 quand les items changent", async () => {
    const { rerender } = render(
      <TestHookComponent items={mockItems} itemsPerPage={10} />
    );

    // Aller à la page 2
    const goToPage2Button = screen.getByTestId("go-to-page-2");
    await userEvent.click(goToPage2Button);
    expect(screen.getByTestId("current-page")).toHaveTextContent("2");

    // Changer les items (ajouter plus d'items)
    const newItems = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));
    rerender(<TestHookComponent items={newItems} itemsPerPage={10} />);

    // Devrait revenir à la page 1
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("ajuste la page courante si elle devient invalide", async () => {
    const { rerender } = render(
      <TestHookComponent items={mockItems} itemsPerPage={10} />
    );

    // Aller à la page 3
    const goToPage2Button = screen.getByTestId("go-to-page-2");
    await userEvent.click(goToPage2Button);
    await userEvent.click(goToPage2Button); // Page 3

    // Réduire le nombre d'items (maintenant seulement 2 pages)
    const fewerItems = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));
    rerender(<TestHookComponent items={fewerItems} itemsPerPage={10} />);

    // Le hook devrait réinitialiser à la page 1 quand les items changent
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("2");
  });

  it("gère correctement les items vides", () => {
    render(<TestHookComponent items={[]} itemsPerPage={10} />);

    expect(screen.getByTestId("total-pages")).toHaveTextContent("0");
    expect(screen.getByTestId("current-items-count")).toHaveTextContent("0");
    expect(screen.getByTestId("has-next")).toHaveTextContent("false");
    expect(screen.getByTestId("has-prev")).toHaveTextContent("false");
  });

  it("gère correctement les itemsPerPage personnalisés", () => {
    render(<TestHookComponent items={mockItems} itemsPerPage={5} />);

    expect(screen.getByTestId("total-pages")).toHaveTextContent("5");
    expect(screen.getByTestId("current-items-count")).toHaveTextContent("5");
  });
});
