/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
import { redirect } from 'next/dist/server/api-utils'
import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { pathname } = request.nextUrl
  const isCookiesExist = !!request.cookies.get("token")
  const isLoginPage = pathname.startsWith('/login')
  const isRegisterPage = pathname.startsWith('/register');
  
  // jika cookies tidak ada dan user lagi tidak di halaman login => redirect ke "/login"
  if (isCookiesExist == false && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // jika cookies ada dan user lagi di halaman login => redirect ke "'/"
  if (isCookiesExist && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Jika cookies ada dan user di halaman register => redirect ke "/"
  if (isCookiesExist && isRegisterPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // console.log("pathname => ", isCookiesExist)

  // return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}