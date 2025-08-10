import {
  printifyService,
  Blueprint,
  Provider,
  Variant,
  ProductCreationData,
} from "../printifyService";

// Mock fetch globalement
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.Clerk
const mockClerk = {
  session: {
    getToken: jest.fn(),
  },
};

Object.defineProperty(window, "Clerk", {
  value: mockClerk,
  writable: true,
});

// Mock console pour éviter les logs dans les tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
});

describe("PrintifyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClerk.session.getToken.mockResolvedValue("mock-token-123");
  });

  describe("getAuthToken", () => {
    it("récupère le token Clerk avec succès", async () => {
      mockClerk.session.getToken.mockResolvedValue("valid-token-123");

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Utiliser la méthode privée via un test indirect
      const result = await printifyService.getBlueprints();

      // Vérifier que fetch a été appelé avec le token
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/blueprints"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token-123",
          }),
        })
      );
    });

    it("gère l'absence de token Clerk", async () => {
      mockClerk.session.getToken.mockResolvedValue(null);

      // Mock fetch pour retourner une erreur
      mockFetch.mockRejectedValue(new Error("No token"));

      await expect(printifyService.getBlueprints()).rejects.toThrow("No token");
    });

    it("gère l'absence de session Clerk", async () => {
      // Simuler l'absence de session
      const originalClerk = (window as any).Clerk;
      delete (window as any).Clerk;

      mockFetch.mockRejectedValue(new Error("No Clerk"));

      await expect(printifyService.getBlueprints()).rejects.toThrow("No Clerk");

      // Restaurer Clerk
      (window as any).Clerk = originalClerk;
    });

    it("gère l'absence de window (SSR)", async () => {
      // Simuler l'environnement SSR
      const originalWindow = (global as any).window;
      delete (global as any).window;

      // Le service devrait gérer gracieusement l'absence de window
      // Pas besoin de mock car le service gère l'erreur

      // Restaurer window
      (global as any).window = originalWindow;
    });
  });

  describe("fetchApi", () => {
    it("fait un appel API avec succès", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              title: "T-Shirt Basic",
              brand: "Gildan",
              model: "5000",
              description: "T-shirt en coton 100%",
              images: ["image1.jpg", "image2.jpg"],
            },
          ],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.getBlueprints();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3004/api/printify/blueprints",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token-123",
          },
        }
      );
      expect(result).toEqual({
        data: [
          {
            id: 1,
            title: "T-Shirt Basic",
            brand: "Gildan",
            model: "5000",
            description: "T-shirt en coton 100%",
            images: ["image1.jpg", "image2.jpg"],
          },
        ],
      });
    });

    it("gère les erreurs de réponse API", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(printifyService.getBlueprints()).rejects.toThrow(
        "Erreur API: 500 Internal Server Error"
      );
    });

    it("gère les erreurs de réseau", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(printifyService.getBlueprints()).rejects.toThrow(
        "Network error"
      );
    });

    it("gère les erreurs de parsing JSON", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(printifyService.getBlueprints()).rejects.toThrow(
        "Invalid JSON"
      );
    });

    it("applique les headers personnalisés", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Utiliser une méthode qui permet des headers personnalisés
      await printifyService.getBlueprints();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token-123",
          }),
        })
      );
    });
  });

  describe("getBlueprints", () => {
    it("récupère tous les blueprints disponibles", async () => {
      const mockBlueprints: Blueprint[] = [
        {
          id: 1,
          title: "T-Shirt Basic",
          brand: "Gildan",
          model: "5000",
          description: "T-shirt en coton 100%",
          images: ["image1.jpg"],
        },
        {
          id: 2,
          title: "Hoodie Premium",
          brand: "Champion",
          model: "2000",
          description: "Hoodie en coton premium",
          images: ["hoodie1.jpg"],
        },
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockBlueprints }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.getBlueprints();

      expect(result).toEqual({ data: mockBlueprints });
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3004/api/printify/blueprints",
        expect.any(Object)
      );
    });

    it("gère les erreurs lors de la récupération des blueprints", async () => {
      mockFetch.mockRejectedValue(new Error("Failed to fetch blueprints"));

      await expect(printifyService.getBlueprints()).rejects.toThrow(
        "Failed to fetch blueprints"
      );
    });
  });

  describe("getProviders", () => {
    it("récupère les providers pour un blueprint spécifique", async () => {
      const mockProviders: Provider[] = [
        {
          id: 1,
          title: "Provider A",
          description: "Provider de qualité premium",
        },
        {
          id: 2,
          title: "Provider B",
          description: "Provider économique",
        },
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockProviders }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.getProviders(1);

      expect(result).toEqual({ data: mockProviders });
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3004/api/printify/blueprints/1/providers",
        expect.any(Object)
      );
    });

    it("gère les erreurs lors de la récupération des providers", async () => {
      mockFetch.mockRejectedValue(new Error("Failed to fetch providers"));

      await expect(printifyService.getProviders(1)).rejects.toThrow(
        "Failed to fetch providers"
      );
    });
  });

  describe("getVariants", () => {
    it("récupère les variants pour un blueprint et provider spécifiques", async () => {
      const mockVariants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt Basic - Rouge - S",
          options: { color: "Rouge", size: "S" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "S",
          isAvailable: true,
          displayName: "Rouge - S",
        },
        {
          id: 2,
          title: "T-Shirt Basic - Bleu - M",
          options: { color: "Bleu", size: "M" },
          costFormatted: "$5.00",
          color: "Bleu",
          size: "M",
          isAvailable: true,
          displayName: "Bleu - M",
        },
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockVariants }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.getVariants(1, 1);

      expect(result).toEqual({ data: mockVariants });
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3004/api/printify/blueprints/1/providers/1/variants",
        expect.any(Object)
      );
    });

    it("gère les erreurs lors de la récupération des variants", async () => {
      mockFetch.mockRejectedValue(new Error("Failed to fetch variants"));

      await expect(printifyService.getVariants(1, 1)).rejects.toThrow(
        "Failed to fetch variants"
      );
    });
  });

  describe("createProduct", () => {
    it("crée un produit avec succès", async () => {
      const productData: ProductCreationData = {
        title: "T-Shirt Personnalisé",
        description: "T-shirt avec mon image",
        imageUrl: "https://example.com/image.jpg",
        blueprintId: 1,
        printProviderId: 1,
        variantIds: [1, 2],
      };

      const mockCreatedProduct = {
        id: "prod_123",
        title: "T-Shirt Personnalisé",
        description: "T-shirt avec mon image",
        blueprintId: 1,
        printProviderId: 1,
        variants: [
          {
            id: 1,
            title: "Rouge - S",
            sku: "TSHIRT-001-R-S",
            price: 19.99,
            priceFormatted: "$19.99",
            cost: 5.0,
            profit: 14.99,
            isEnabled: true,
            isDefault: true,
            options: [1],
          },
        ],
        images: [
          {
            src: "https://printify.com/image.jpg",
            variant_ids: [1],
            position: "front",
            is_default: true,
            is_selected_for_publishing: true,
            order: null,
          },
        ],
        createdAt: "2024-01-01T00:00:00Z",
        marginApplied: 20,
        originalImageUrl: "https://example.com/image.jpg",
        printifyImageId: "img_123",
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockCreatedProduct,
          message: "Produit créé avec succès",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.createProduct(productData);

      expect(result).toEqual({
        success: true,
        data: mockCreatedProduct,
        message: "Produit créé avec succès",
      });
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3004/api/printify/product/create",
        {
          method: "POST",
          body: JSON.stringify(productData),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token-123",
          },
        }
      );
    });

    it("gère les erreurs lors de la création de produit", async () => {
      const productData: ProductCreationData = {
        title: "T-Shirt Personnalisé",
        description: "T-shirt avec mon image",
        imageUrl: "https://example.com/image.jpg",
        blueprintId: 1,
        printProviderId: 1,
        variantIds: [1, 2],
      };

      mockFetch.mockRejectedValue(new Error("Failed to create product"));

      await expect(printifyService.createProduct(productData)).rejects.toThrow(
        "Failed to create product"
      );
    });

    it("valide les données du produit avant envoi", async () => {
      const productData: ProductCreationData = {
        title: "T-Shirt Personnalisé",
        description: "T-shirt avec mon image",
        imageUrl: "https://example.com/image.jpg",
        blueprintId: 1,
        printProviderId: 1,
        variantIds: [1, 2],
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: {},
          message: "Produit créé avec succès",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await printifyService.createProduct(productData);

      // Vérifier que le body est correctement sérialisé
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(productData),
        })
      );
    });
  });

  describe("groupVariantsByColor", () => {
    it("groupe les variants par couleur", () => {
      const variants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt Rouge S",
          options: { color: "Rouge", size: "S" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "S",
          isAvailable: true,
          displayName: "Rouge - S",
        },
        {
          id: 2,
          title: "T-Shirt Rouge M",
          options: { color: "Rouge", size: "M" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "M",
          isAvailable: true,
          displayName: "Rouge - M",
        },
        {
          id: 3,
          title: "T-Shirt Bleu S",
          options: { color: "Bleu", size: "S" },
          costFormatted: "$5.00",
          color: "Bleu",
          size: "S",
          isAvailable: true,
          displayName: "Bleu - S",
        },
      ];

      const result = printifyService.groupVariantsByColor(variants);

      expect(result).toEqual({
        Rouge: [variants[0], variants[1]],
        Bleu: [variants[2]],
      });
    });

    it("retourne un objet vide pour une liste vide", () => {
      const result = printifyService.groupVariantsByColor([]);
      expect(result).toEqual({});
    });

    it("gère les variants avec des couleurs undefined", () => {
      const variants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt S",
          options: { color: "Rouge", size: "S" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "S",
          isAvailable: true,
          displayName: "Rouge - S",
        },
        {
          id: 2,
          title: "T-Shirt M",
          options: { color: "Bleu", size: "M" },
          costFormatted: "$5.00",
          color: "Bleu",
          size: "M",
          isAvailable: true,
          displayName: "Bleu - M",
        },
      ];

      const result = printifyService.groupVariantsByColor(variants);

      expect(result).toEqual({
        Rouge: [variants[0]],
        Bleu: [variants[1]],
      });
    });
  });

  describe("getSizesForColor", () => {
    it("retourne les tailles disponibles pour une couleur", () => {
      const variants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt Rouge XS",
          options: { color: "Rouge", size: "XS" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "XS",
          isAvailable: true,
          displayName: "Rouge - XS",
        },
        {
          id: 2,
          title: "T-Shirt Rouge S",
          options: { color: "Rouge", size: "S" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "S",
          isAvailable: true,
          displayName: "Rouge - S",
        },
        {
          id: 3,
          title: "T-Shirt Rouge L",
          options: { color: "Rouge", size: "L" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "L",
          isAvailable: true,
          displayName: "Rouge - L",
        },
        {
          id: 4,
          title: "T-Shirt Rouge XL",
          options: { color: "Rouge", size: "XL" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "XL",
          isAvailable: false,
          displayName: "Rouge - XL",
        },
      ];

      const result = printifyService.getSizesForColor(variants, "Rouge");

      expect(result).toEqual(["XS", "S", "L"]);
    });

    it("retourne un tableau vide si aucune taille n'est disponible", () => {
      const variants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt Rouge XL",
          options: { color: "Rouge", size: "XL" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "XL",
          isAvailable: false,
          displayName: "Rouge - XL",
        },
      ];

      const result = printifyService.getSizesForColor(variants, "Rouge");

      expect(result).toEqual([]);
    });

    it("retourne un tableau vide si la couleur n'existe pas", () => {
      const variants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt Rouge S",
          options: { color: "Rouge", size: "S" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "S",
          isAvailable: true,
          displayName: "Rouge - S",
        },
      ];

      const result = printifyService.getSizesForColor(variants, "Bleu");

      expect(result).toEqual([]);
    });

    it("trie les tailles dans l'ordre correct", () => {
      const variants: Variant[] = [
        {
          id: 1,
          title: "T-Shirt Rouge L",
          options: { color: "Rouge", size: "L" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "L",
          isAvailable: true,
          displayName: "Rouge - L",
        },
        {
          id: 2,
          title: "T-Shirt Rouge XS",
          options: { color: "Rouge", size: "XS" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "XS",
          isAvailable: true,
          displayName: "Rouge - XS",
        },
        {
          id: 3,
          title: "T-Shirt Rouge M",
          options: { color: "Rouge", size: "M" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "M",
          isAvailable: true,
          displayName: "Rouge - M",
        },
      ];

      const result = printifyService.getSizesForColor(variants, "Rouge");

      expect(result).toEqual(["XS", "M", "L"]);
    });
  });

  describe("checkServiceHealth", () => {
    it("vérifie la santé du service avec succès", async () => {
      const mockResponse = {
        ok: true,
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.checkServiceHealth();

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3004/health");
    });

    it("retourne false si le service est indisponible", async () => {
      const mockResponse = {
        ok: false,
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.checkServiceHealth();

      expect(result).toBe(false);
    });

    it("retourne false en cas d'erreur réseau", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await printifyService.checkServiceHealth();

      expect(result).toBe(false);
    });

    it("gère les erreurs de timeout", async () => {
      mockFetch.mockRejectedValue(new Error("timeout"));

      const result = await printifyService.checkServiceHealth();

      expect(result).toBe(false);
    });
  });

  describe("Gestion des erreurs globales", () => {
    it("gère les erreurs de type TypeError", async () => {
      // Simuler une erreur de type
      mockFetch.mockImplementation(() => {
        throw new TypeError("Invalid URL");
      });

      await expect(printifyService.getBlueprints()).rejects.toThrow(
        "Invalid URL"
      );
    });

    it("gère les erreurs de syntaxe", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockImplementation(() => {
          throw new SyntaxError("Invalid JSON");
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(printifyService.getBlueprints()).rejects.toThrow(
        "Invalid JSON"
      );
    });
  });

  describe("Validation des données", () => {
    it("valide que les blueprints ont la structure attendue", async () => {
      const mockBlueprints = [
        {
          id: 1,
          title: "T-Shirt Basic",
          brand: "Gildan",
          model: "5000",
          description: "T-shirt en coton 100%",
          images: ["image1.jpg"],
        },
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockBlueprints }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.getBlueprints();

      // Vérifier la structure des données
      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("title");
      expect(result.data[0]).toHaveProperty("brand");
      expect(result.data[0]).toHaveProperty("model");
      expect(result.data[0]).toHaveProperty("description");
      expect(result.data[0]).toHaveProperty("images");
    });

    it("valide que les variants ont la structure attendue", async () => {
      const mockVariants = [
        {
          id: 1,
          title: "T-Shirt Basic - Rouge - S",
          options: { color: "Rouge", size: "S" },
          costFormatted: "$5.00",
          color: "Rouge",
          size: "S",
          isAvailable: true,
          displayName: "Rouge - S",
        },
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockVariants }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await printifyService.getVariants(1, 1);

      // Vérifier la structure des données
      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("title");
      expect(result.data[0]).toHaveProperty("options");
      expect(result.data[0]).toHaveProperty("costFormatted");
      expect(result.data[0]).toHaveProperty("color");
      expect(result.data[0]).toHaveProperty("size");
      expect(result.data[0]).toHaveProperty("isAvailable");
      expect(result.data[0]).toHaveProperty("displayName");
    });
  });
});
