import { User } from "@prisma/client";
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";

export default function UserCard({ user }: { user: User }) {
    return (
        <Card className="p-2 rounded-sm">
            <div className="flex">
                <a href={"/user/profile/" + user.handle} className="flex bg-purple-200">
                    <Image src={user.imageUrl || ""} alt="Profile Picture" width={60} height={60} />
                </a>
                <div className="flex flex-col ml-2 justify-center">
                    <Link
                        href={"/user/profile/" + user.handle}
                        className="text-lg font-semibold hover:text-primary group"
                    >
                        {user.firstName + " " + user.lastName}
                    </Link>
                    <p className="text-sm font-light text-muted-foreground group-hover:text-primary"> @{user.handle}</p>
                </div>
            </div>
        </Card>
    );
}