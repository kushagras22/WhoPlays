import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { FC } from "react"

const figtree = Figtree({
    subsets: ["latin"],
})

const description =
    "Hey everyone, Welcome to my website! WhoPlays"

export const metadata: Metadata = {
    title: {
        template: "%s | Kushagra ",
        default: "WhoPlays 𝄞⨾𓍢ִ໋",
    },
    description,
    openGraph: {
        type: "website",
        title: "WhoPlays 𝄞⨾𓍢ִ໋",
        siteName: "WhoPlays 𝄞⨾𓍢ִ໋",
        url: "https://github.com/",
        description,
        images: [
            {
                url: "/og.jpg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "WhoPlays 𝄞⨾𓍢ִ໋",
        description,
        images: [
            {
                url: "/og.jpg",
            },
        ],
    },
}

type RootLayoutProps = {
    children: React.ReactNode
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <body className={cn("bg-zinc-50 antialiased", figtree.className)}>
                {children}
            </body>
        </html>
    )
}

export default RootLayout
