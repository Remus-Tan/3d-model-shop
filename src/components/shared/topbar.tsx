import Image from "next/image";
import Link from "next/link";
import SearchBar from "./searchbar";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

import {
    SignInButton,
    SignOutButton,
    SignUpButton,
    UserButton,
    UserProfile,
    auth
} from "@clerk/nextjs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

export default function Topbar() {
    const { userId } = auth();

    return (
        <nav className="sticky top-0 left-0 right-0 shadow-sm flex items-center p-2 h-18 z-50 gap-4">
            <Link href="/" className="flex items-center">
                <Image
                    alt="logo"
                    src="/logo.svg"
                    width={64}
                    height={64}
                />
                <p className="text-yellow-500 font-semibold">
                    3D Shop
                </p>
            </Link>
            <SearchBar />
            <ModeToggle />

            {userId && (<UserButton />)}
            {!userId && (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant={"ghost"} className="dark:">
                                Log in
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="flex-col items-start focus:bg-white">
                                <p>
                                    Don&apos;t have an account?
                                </p>
                                <SignUpButton mode="modal">
                                    <p className="cursor-pointer">
                                        Click here to sign up!
                                    </p>
                                </SignUpButton>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="focus:bg-white">
                                <SignInButton mode="modal">
                                    <Button className="w-full">
                                        Log In
                                    </Button>
                                </SignInButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <UserButton />
                </>
            )}
        </nav>
    );
}