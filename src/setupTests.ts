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

    // 3) Avertissements styled-jsx (jsx et global props) - SUPPRIMER COMPLÈTEMENT
    const isStyledJsxWarning =
      msg.includes("Received `true` for a non-boolean attribute `jsx`") ||
      msg.includes("Received `true` for a non-boolean attribute `global`") ||
      msg.includes("jsx") ||
      msg.includes("global");

    // 4) Avertissements Next.js Image component attributes - SUPPRIMER
    const isNextImageWarning =
      msg.includes("Received `true` for a non-boolean attribute `fill`") ||
      msg.includes("Received `true` for a non-boolean attribute `priority`") ||
      msg.includes("Received `true` for a non-boolean attribute `sizes`");

    // 5) Autres messages de test à ignorer
    const shouldIgnore = isActWarning || isNetworkError || isStyledJsxWarning || isNextImageWarning;

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
