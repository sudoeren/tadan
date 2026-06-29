import { NextResponse, type NextRequest } from "next/server"
import { isMobileUserAgent } from "@/lib/mobile"

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent")
  if (!isMobileUserAgent(ua)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = "/mobile-soon"
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|mobile-soon|.*\\.svg$).*)",
  ],
}
