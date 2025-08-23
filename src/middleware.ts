import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/features",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// ✅ ignore explicitement l’optimizer et les assets
export const config = {
  matcher: [
    // toujours exécuter sur les routes app, sauf assets et fichiers statiques
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)",
    // et surtout, ignorer explicitement :
    // (ces lignes garantissent que Clerk ne verra pas les assets)
    // NB: ces lignes ne sont pas des matchers "positifs", mais des exclusions
  ],
  // alternative (plus claire) si tu veux explicitement ignorer :
  // ignoredRoutes: ["/_next/static(.*)", "/_next/image(.*)", "/favicon.ico", "/images(.*)"],
};
