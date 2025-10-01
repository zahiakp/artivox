import { NextResponse } from 'next/server'
import { brandName } from './app/data/branding'

// This function can be marked `async` if using `await` inside
export function middleware(request:any) {
  const url = request.nextUrl
  const pathname= url.pathname
  const access = request.cookies.has(`${brandName}-access`)
  const cookie=request.cookies.get(`${brandName}-access`)
  if(cookie){
    var role = JSON.parse(cookie?.value).role

  }
  if(access){
    if(pathname==='/login'){
        return NextResponse.redirect(new URL('/', request.url))
    }
    if(pathname=='/campus'  && role && (role!=='admin')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname==='/judgment' &&role && (role!=='admin' && role!=='judge')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname==='/results' &&role && (role!=='admin' && role!=='announce')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname=='/students' &&role && (role!=='campus')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname=='/registration' &&role && (role!=='admin' && role!=='report')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname=='/award' &&role && (role!=='admin' && role!=='award')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname=='/annoucement' &&role && (role!=='admin'&& role!=='announce')){
      return NextResponse.redirect(new URL('/unauthorized', request.url))      
    }
    if(pathname=='/topics' &&role && role!=='admin' && role!=='judge'){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if(pathname=='/award' &&role && role!=='admin' && role!=='award' && role!=='result'){
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    return NextResponse.next()
  }
  if(pathname=='/login'){
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/login', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/','/login','/campus/:path*','/results/:path*','/programs/:path*','/students/:path*','/registration/:path*','/judge/:path*','/announcement/:path*','/topics/:path*'],
}