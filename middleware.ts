import { withAuth } from 'next-auth/middleware'

export default withAuth({
    pages: {
        signIn:'/',
    }
    
})
export const config = {
    matcher: [
        "/dashboard/:path*","/sheet/:path*","/resource/:path*","/leaderboard/:path*","/store/:path*"
    ]
}