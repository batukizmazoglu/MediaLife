import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Korumak istediğiniz tüm sayfaları buraya ekleyin
  matcher: ["/", "/admin/:path*"], 
};
