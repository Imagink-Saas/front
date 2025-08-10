import { paymentService } from "../paymentService";

// Mock fetch globalement
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error pour éviter les logs dans les tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("PaymentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Configuration", () => {
    it("utilise l'URL par défaut si NEXT_PUBLIC_PAYMENT_SERVICE_URL n'est pas défini", () => {
      // Simuler l'absence de la variable d'environnement
      const originalEnv = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;
      delete process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;

      // Recréer le service pour tester la configuration
      jest.resetModules();
      const { paymentService: newService } = require("../paymentService");

      // Vérifier que l'URL par défaut est utilisée
      expect(newService.baseUrl).toBe("http://localhost:9001/api");

      // Restaurer l'environnement
      process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL = originalEnv;
    });

    it("utilise NEXT_PUBLIC_PAYMENT_SERVICE_URL si défini", () => {
      const customUrl = "https://custom-payment-service.com/api";
      process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL = customUrl;

      // Recréer le service pour tester la configuration
      jest.resetModules();
      const { paymentService: newService } = require("../paymentService");

      expect(newService.baseUrl).toBe(customUrl);
    });
  });

  describe("getUserCredits", () => {
    it("récupère les crédits d'un utilisateur avec succès", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            userId: "user123",
            credits: 25,
            canGenerate: true,
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.getUserCredits("user123");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/credits/user123",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual({
        userId: "user123",
        credits: 25,
        canGenerate: true,
      });
    });

    it("gère les erreurs de réponse avec détails", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({
          error: "User not found",
          details: "User with ID user123 does not exist",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(paymentService.getUserCredits("user123")).rejects.toThrow(
        "Failed to fetch user credits: User not found (User with ID user123 does not exist)"
      );
    });

    it("gère les erreurs de réponse sans détails", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(paymentService.getUserCredits("user123")).rejects.toThrow(
        "Failed to fetch user credits"
      );
    });

    it("gère les erreurs de parsing JSON", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(paymentService.getUserCredits("user123")).rejects.toThrow(
        "Failed to fetch user credits"
      );
    });
  });

  describe("useCredits", () => {
    it("utilise des crédits avec succès", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            creditsUsed: 1,
            remainingCredits: 24,
            canGenerate: true,
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.useCredits("user123", 1);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/credits/use",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user123",
            amount: 1,
          }),
        }
      );
      expect(result).toEqual({
        creditsUsed: 1,
        remainingCredits: 24,
        canGenerate: true,
      });
    });

    it("utilise le montant par défaut (1) si non spécifié", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            creditsUsed: 1,
            remainingCredits: 24,
            canGenerate: true,
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await paymentService.useCredits("user123");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/credits/use",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user123",
            amount: 1,
          }),
        }
      );
    });

    it("gère l'erreur de crédits insuffisants", async () => {
      const mockResponse = {
        ok: false,
        status: 402,
        json: jest.fn().mockResolvedValue({
          error: "Insufficient credits",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(paymentService.useCredits("user123", 1)).rejects.toThrow(
        "Insufficient credits"
      );
    });

    it("gère les autres erreurs de réponse", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({
          error: "Server error",
          details: "Internal server error",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(paymentService.useCredits("user123", 1)).rejects.toThrow(
        "Failed to use credits: Server error (Internal server error)"
      );
    });
  });

  describe("createPaymentSession", () => {
    it("crée une session de paiement avec succès", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            sessionId: "sess_123",
            url: "https://checkout.stripe.com/pay/sess_123",
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.createPaymentSession(
        "user123",
        "package_100"
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/payment/create-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user123",
            creditPackage: "package_100",
          }),
        }
      );
      expect(result).toEqual({
        sessionId: "sess_123",
        url: "https://checkout.stripe.com/pay/sess_123",
      });
    });

    it("gère les erreurs de création de session", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          error: "Invalid package",
          details: "Package not found",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(
        paymentService.createPaymentSession("user123", "invalid_package")
      ).rejects.toThrow(
        "Failed to create payment session: Invalid package (Package not found)"
      );
    });
  });

  describe("getCreditPackages", () => {
    it("récupère les packages de crédits avec succès", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            {
              id: "package_100",
              name: "100 Crédits",
              credits: 100,
              price: 9.99,
              priceId: "price_100",
              description: "100 crédits pour générer des images",
            },
            {
              id: "package_500",
              name: "500 Crédits",
              credits: 500,
              price: 39.99,
              priceId: "price_500",
              description: "500 crédits pour générer des images",
            },
          ],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.getCreditPackages();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/packages",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "package_100",
        name: "100 Crédits",
        credits: 100,
        price: 9.99,
        priceId: "price_100",
        description: "100 crédits pour générer des images",
      });
    });

    it("gère les erreurs de récupération des packages", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({
          error: "Failed to fetch packages",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(paymentService.getCreditPackages()).rejects.toThrow(
        "Failed to fetch credit packages: Failed to fetch packages"
      );
    });
  });

  describe("canGenerateImage", () => {
    it("retourne true si l'utilisateur peut générer une image", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            userId: "user123",
            credits: 5,
            canGenerate: true,
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.canGenerateImage("user123");

      expect(result).toBe(true);
    });

    it("retourne false si l'utilisateur ne peut pas générer une image", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            userId: "user123",
            credits: 0,
            canGenerate: false,
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.canGenerateImage("user123");

      expect(result).toBe(false);
    });

    it("retourne false en cas d'erreur", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({
          error: "Server error",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await paymentService.canGenerateImage("user123");

      expect(result).toBe(false);
    });
  });

  describe("redirectToPayment", () => {
    it("appelle createPaymentSession et gère les succès", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            sessionId: "sess_123",
            url: "https://checkout.stripe.com/pay/sess_123",
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Mock console.error pour éviter les logs dans les tests
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await paymentService.redirectToPayment("user123", "package_100");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/payment/create-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user123",
            creditPackage: "package_100",
          }),
        }
      );

      consoleSpy.mockRestore();
    });

    it("gère les erreurs de création de session", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          error: "Invalid package",
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Mock console.error pour éviter les logs dans les tests
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await paymentService.redirectToPayment("user123", "invalid_package");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:9001/api/payment/create-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user123",
            creditPackage: "invalid_package",
          }),
        }
      );

      consoleSpy.mockRestore();
    });
  });
});
