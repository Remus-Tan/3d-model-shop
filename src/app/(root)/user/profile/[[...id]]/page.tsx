import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Metadata, ResolvingMetadata } from "next";
import { Likes, Model, User } from "@prisma/client";
import FollowButton from "./_components/followButton";
import { Box, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ModelCard from "@/components/shared/model-card";

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const user = await getUserProfile({ params });

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: user ? user.firstName + " " + user.lastName + " (@" + user.handle + ")" : "User Not Found",
        openGraph: {
            images: [...previousImages],
        },
    };
}

async function getUserProfile(
    { params }: { params: { id: string } }
) {
    const user = await currentUser();

    const hasParams = Object.keys(params).length !== 0;
    const searchId = hasParams ? params.id : user?.id;

    const apiRoute = process.env.NEXT_PUBLIC_BASE_URL + (hasParams ? "/api/users/handle/" : "/api/users/");
    const userProfile: User = await fetch(apiRoute + searchId, {
        next: {
            revalidate: 0
        }
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return;
        }
    });

    return userProfile;
}

// This function retrieves the count of users following / being followed by the profile that is currently being viewed
async function getFollowData(userId: string) {
    const followData = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/users/follow-data/" + userId, {
        next: {
            revalidate: 0
        }
    }).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            return;
        }
    });

    return followData;
}

export default async function Profile({
    params,
    searchParams
}: {
    params: { id: string },
    searchParams: { tab: string }
}
) {
    const user = await getUserProfile({ params });
    const followData = await getFollowData(user.id);

    if (!user) {
        return (
            <h1 className="border-2 bg-secondary text-foreground w-fit m-auto mt-12 p-8 font-semibold">
                User does not exist!
            </h1>
        );
    }

    const loggedInUser = await currentUser();
    const { id, email, emailPublic, firstName, lastName, handle, headline, aboutMe, imageUrl, externalUrls, skills } = await getUserProfile({ params });

    const profileProps = {
        className: "mt-6 px-[12vw]",
        searchParams
    };

    return (<>
        <ProfileBanner className="bg-zinc-700 dark:bg-zinc-900 px-[12vw]" />
        <Profile {...profileProps} />
    </>);

    function ProfileBanner({ className }: React.HTMLAttributes<HTMLElement>) {
        return (
            <div className={className}>
                <div className="max-w-[2000px] m-auto flex py-8 text-white">
                    <Image src={imageUrl || ""} alt="Profile picture" width="110" height="110" className="border border-border shadow-md rounded-sm" />

                    <div className="ml-5 flex flex-col">
                        <div className="flex mt-1 items-baseline">
                            <p className="font-extralight text-3xl tracking-tight">{firstName + " " + lastName}</p>
                            <p className="font-extralight text-lg ml-4">{"@" + handle}</p>
                        </div>

                        <p className="text-md mt-auto">{headline}</p>

                        <div className="flex text-sm mt-auto gap-4 items-center">
                            <Link href={"/"}>{followData.followerCount} <span className="font-extralight"> Followers</span></Link>
                            <Link href={"/"}>{followData.followingCount} <span className="font-extralight"> Following</span></Link>
                            {
                                (loggedInUser && loggedInUser?.id != id) &&
                                <FollowButton loggedInUser={loggedInUser!.id} targetUser={id} />
                            }
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    function Profile({
        className,
        searchParams
    }: {
        className: string,
        searchParams: { tab: string }
    }) {
        return (
            <div className={className}>
                <div className="max-w-[2000px] m-auto ">
                    <Tabs defaultValue={Object.keys(searchParams).length !== 0 ? searchParams.tab : "profile"} className="flex flex-col">
                        <TabsList className="self-center">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="models">Models</TabsTrigger>
                            <TabsTrigger value="likes">Likes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="flex mt-4 gap-6">
                            <div className="m-auto flex flex-col space-y-6">
                                <ProfileCard />
                                {(skills as []).some(skill => skill !== "") && <StatsCard />}
                            </div>
                        </TabsContent>
                        <TabsContent value="models" className="m-auto">
                            <ModelsCard />
                        </TabsContent>
                        <TabsContent value="likes" className="m-auto">
                            <LikesCard />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        );
    }

    function ProfileCard() {
        return (
            <Card className="border-border shadow-md">
                <CardHeader>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription className="text-md whitespace-pre-line">{aboutMe ? aboutMe : "Nothing here... yet!"}</CardDescription>
                </CardHeader>
                {emailPublic && (
                    <CardContent>
                        <CardDescription className="text-md flex gap-2">Email</CardDescription>

                        <a href={`mailto:${email}`} className="underline">{email}</a>
                    </CardContent>
                )}
                {(externalUrls as []).length != 0 && (
                    <CardContent>
                        <CardDescription className="text-md flex gap-2">Links</CardDescription>

                        <ul>
                            {(externalUrls as []).map(({ url }: { url: string }) => (
                                <li key={url}>
                                    <a target="_blank" href={url} rel="noopener noreferrer" className="align-middle underline hover:text-primary">
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                )}
            </Card>
        );
    }

    async function LikesCard() {
        const likes: [Likes] = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/like-data/" + user.id, {
            next: { revalidate: 0 }
        })
            .then(res => res.json());

        var likesArray: Model[] = [];

        for (let i = 0; i < likes.length; i++) {
            await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/" + likes[i].modelId, {
                next: { revalidate: 0 }
            })
                .then(async res => {
                    const model = await res.json();
                    likesArray.push(model);
                });
        };

        return (
            <div className="flex flex-wrap gap-8 justify-center">
                {
                    likesArray.length === 0 &&
                    <Card className="w-fit border-border shadow-md">
                        <CardHeader>
                            <CardDescription className="text-md">Nothing here... yet!</CardDescription>
                        </CardHeader>
                    </Card>
                }
                {
                    likesArray.length !== 0 &&
                    likesArray.map((model: Model) => (
                        <ModelCard model={model} key={model.id} />
                    ))
                }
            </div>
        );
    }

    async function ModelsCard() {
        const results = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/user/" + user.id, {
            next: {
                revalidate: 0
            }
        })
            .then(res => res.json());

        return (
            <div className="flex flex-wrap gap-8 justify-center">
                {
                    results.length === 0 &&
                    <Card className="w-fit border-border shadow-md">
                        <CardHeader>
                            <CardDescription className="text-md">Nothing here... yet!</CardDescription>
                        </CardHeader>
                    </Card>
                }
                {
                    results.length !== 0 &&
                    results.map((model: Model) => (
                        <ModelCard model={model} key={model.id} />
                    ))
                }
            </div>
        );
    }

    function StatsCard() {
        return (
            <Card className="border-border shadow-md">
                <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription className="text-md"></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 max-w-xl">
                    {(skills as []).map((skill) => {
                        if (skill != "") return <Badge key={skill}>{skill}</Badge>;
                    })}
                </CardContent>
            </Card>
        );
    };
};