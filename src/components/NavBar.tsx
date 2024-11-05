import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { buttonVariants } from "./ui/button"
import { ArrowRightIcon } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs"

const NavBar = async () => {
    const user = await currentUser();
    const isAdmin = user?.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL;

    return (
        <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href='/' className="flex z-40 font-semibold text-black">
                        case<span className="text-green-600">cobra</span>
                    </Link>
                    <div className="h-full flex items-center space-x-4">
                        {user ? (
                            <>
                                <SignOutButton>
                                    <Link
                                        href="/"
                                        className={buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                            className: "text-black",
                                        })}>
                                        Sign Out
                                    </Link>
                                </SignOutButton>
                                {isAdmin ? (
                                    <Link
                                        href="/dashboard"
                                        className={buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                            className: "text-black",
                                        })}>
                                        Dashboard ✨
                                    </Link>
                                ) : null}
                                <Link
                                    href="/configure/upload"
                                    className={buttonVariants({
                                        size: "sm",
                                        className: "hidden sm:flex items-center gap-1 text-black",
                                    })}>
                                    Create Case
                                    <ArrowRightIcon className="ml-1.5 h-5 w-5 inline" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <SignUpButton mode="modal">
                                    <button
                                        className={buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                            className: "text-black",
                                        })}>
                                        Sign Up
                                    </button>
                                </SignUpButton>
                                <SignInButton mode="modal">
                                    <button
                                        className={buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                            className: "text-black",
                                        })}>
                                        Login
                                    </button>
                                </SignInButton>
                                <div className="h-8 w-px bg-zinc-200 sm:block hidden" />
                                <Link
                                    href="/configure/upload"
                                    className={buttonVariants({
                                        size: "sm",
                                        className: "hidden sm:flex items-center gap-1 text-black",
                                    })}>
                                    Create Case
                                    <ArrowRightIcon className="ml-1.5 h-5 w-5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default NavBar