"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Item } from "@radix-ui/react-dropdown-menu";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { usePathname } from "next/navigation";

const homeNavItems = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "Browse",
        href: "/browse"
    },
    {
        title: "My Feed",
        href: "/feed",
    }
];

export default function HomeNav() {
    const { isSignedIn } = useAuth();
    const pathname = usePathname();

    return (
        <nav className="pl-8 flex shadow-md">
            {homeNavItems.map((item) => {
                if (item.title === "My Feed" && !isSignedIn) { return <></>; }
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => revalidatePath(item.href)}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "border-b-[3px] rounded-none",
                            pathname === item.href ?
                                "text-primary border-primary border-b-[3px]" :
                                "text-foreground border-background hover:bg-muted hover:border-muted"
                        )
                        }
                    >
                        {item.title}
                    </Link>
                );
            })
            }
        </nav>
    );
}