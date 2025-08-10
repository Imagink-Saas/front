import "@testing-library/jest-dom";

// Mock de window.Clerk pour éviter les erreurs "Clerk non disponible"
Object.defineProperty(window, "Clerk", {
  value: {
    session: {
      getToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
  writable: true,
});

// Mock de fetch global pour éviter les erreurs réseau
global.fetch = jest.fn();

// Mock intelligent de console.error pour filtrer les messages de test
const originalError = console.error;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    const msg = args.map(String).join(" ");

    // 1) Warnings React "not wrapped in act"
    const isActWarning =
      msg.includes("not wrapped in act(") ||
      msg.includes("warnIfUpdatesNotWrappedWithActDEV") ||
      msg.includes("Warning: An update to") ||
      msg.includes("was not wrapped in act");

    // 2) Erreurs réseau volontairement simulées dans les tests
    const isNetworkError =
      msg.includes("Erreur réseau") ||
      msg.includes("Error: Erreur réseau") ||
      msg.includes("Token Clerk null") ||
      msg.includes("Aucun token Clerk disponible");

    // 3) Autres messages de test à ignorer
    const shouldIgnore = isActWarning || isNetworkError;

    if (shouldIgnore) {
      return; // NE PAS rappeler originalError => silence total
    }

    // Sinon : laisser passer les vraies erreurs utiles
    originalError(...args);
  });
});

afterAll(() => {
  (console.error as unknown as jest.Mock).mockRestore();
});

// Mock de console.log pour éviter le bruit
const originalLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
});
