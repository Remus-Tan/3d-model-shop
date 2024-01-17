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
    auth,
    currentUser
} from "@clerk/nextjs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

export default async function Topbar(type: String) {
    const user = await currentUser();

    return (
        <nav className="sticky top-0 left-0 right-0 shadow-sm flex items-center pl-10 pr-10 p-2 h-18 z-50 gap-4">
            <Link href="/" className="flex items-center">
                <Image
                    alt="logo"
                    src="/logo.svg"
                    width={64}
                    height={64}
                />
                <p className="text-stone-800 font-semibold">
                    3D Shop
                </p>
            </Link>
            <SearchBar />
            <ModeToggle />

            {user?.id && (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Image src={user.imageUrl} alt="Profile picture" width={32} height={32} className="rounded-full"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-0 pt-2 pb-2 mt-2 mr-14">
                            <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                <p>
                                    Account thingy 1
                                </p>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                <p>
                                    Account thingy 1
                                </p>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="pt-1 bg-stone-300" />
                            <SignOutButton>
                                <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                    Log Out
                                </DropdownMenuItem>
                            </SignOutButton>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
            {!user?.id && (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant={"ghost"} className="dark:">
                                Log in
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-0 pt-2 pb-2 mr-14">
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
                </>
            )}
        </nav>
    );
}