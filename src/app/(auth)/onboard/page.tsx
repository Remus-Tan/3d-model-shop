import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Onboard() {
    const user = await currentUser();

    const dbUserEntry = await fetch(`http://localhost:3000/api/users/${user.userId}`);
    if (!user) {
        redirect("/");
    }

    const addUserToDb = await fetch(`http://localhost:3000/api/users/${user.userId}`, {
        method: 'POST',
        body: JSON.stringify({
            id: user?.id,
            email: user?.primaryEmailAddressId,
            name: user?.firstName
        })
    });

    return (
        <div className="flex flex-col justify-center m-auto mt-12 w-fit p-8 rounded-lg border-2 gap-4">
            <Image src={user.imageUrl} alt="Profile picture" width={64} height={64} className="rounded-full self-center" />
            <h1 className="text-4xl font-medium self-center">Welcome to 3D Shop! 😇</h1>

            <p>Would you like to set up your profile now?</p>

            <div className="flex gap-2 justify-end">
                <Link href={"/"} className="w-full">
                    <Button variant={"secondary"} className="w-full">
                        I&apos;ll do it later.
                    </Button>
                </Link>

                <Link href={"/settings"} className="w-full">
                    <Button className="w-full">
                        Yes please!
                    </Button>
                </Link>
            </div>
        </div >
    );
}
