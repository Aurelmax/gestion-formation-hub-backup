import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Le middleware s'exécute pour toutes les routes protégées
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Définir les routes à protéger
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*"
  ]
}