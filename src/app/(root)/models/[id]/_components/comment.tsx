"use client";

import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/clerk-react";
import { Comment, User } from "@prisma/client";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function CommentDisplay(
    { comment }: { comment: Comment }
) {
    const { user, isSignedIn } = useUser();
    const [commentor, setCommentor] = useState({} as User);
    const [isDeleting, setDeleting] = useState(false);
    const [isDeleted, setDeleted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${comment.userId}`, { next: { revalidate: 0 } })
            .then(async res => {
                const data: User = await res.json();
                setCommentor(data);
            });
    }, []);

    return (
        <>
            <div className="flex gap-4">
                {!commentor.imageUrl && <Loader2 className="animate-spin rounded-full bg-background" size={36} strokeWidth="1" color="orange" />}
                {commentor.imageUrl && <>
                    <div>
                        <Image src={commentor.imageUrl} alt="Profile Picture" width={48} height={48} />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-baseline">
                            <Link
                                href={"/user/profile/" + commentor.handle}
                                className="text-primary tracking-tight font-medium">
                                {commentor.firstName} {commentor.lastName}
                            </Link>
                            <p className="text-muted-foreground text-xs font-light ml-2">(@{commentor.handle})</p>
                        </div>
                        <p className="text-muted-foreground text-sm font-light">{String(comment.createdAt)}</p>
                        <p className="whitespace-pre-wrap mt-4">
                            {isDeleted ? "Comment deleted!" : comment.comment}
                        </p>
                    </div>
                    {(user?.id === commentor.id && !isDeleting) &&
                        <div className="ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Trash2 stroke="gray" size={20} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem className="hover:cursor-pointer" onClick={deleteComment} >
                                        Delete comment
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    }
                    {isDeleting &&
                        <div className="ml-auto">
                            <Loader2 className="animate-spin rounded-full bg-background" size={24} strokeWidth="1" color="orange" />
                        </div>
                    }
                </>
                }
            </div >
            <Separator className="my-4" />
        </>
    );

    async function deleteComment() {
        setDeleting(true);
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${comment.id}`, { method: "DELETE" })
            .then(() => setDeleted(true));
    }

    function getTimeDiff() {

    }
}