import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Badge } from "@/components/ui/badge";
import { Metadata, ResolvingMetadata } from "next";
import { User } from "@prisma/client";

async function getUserProfile(
    { params }: { params: { id: string } }
) {
    const user = await currentUser();
    const searchId = Object.keys(params).length !== 0 ? params.id : user?.id;
    const userProfile: User = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/users/" + searchId, {
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

export default async function Profile(
    { params }: { params: { id: string } }
) {
    const user = await getUserProfile({ params });
    if (!user) {
        return (
            <h1 className="border-2 bg-secondary text-foreground w-fit m-auto mt-12 p-8 font-semibold">
                User does not exist!
            </h1>
        );
    }

    const { id, email, emailPublic, firstName, lastName, handle, headline, aboutMe, imageUrl } = await getUserProfile({ params });

    return (<>
        <ProfileBanner className="bg-zinc-700 dark:bg-zinc-900 px-[12vw]" />
        <Profile className="mt-6 px-[12vw]" />
        </>);

    function ProfileBanner({ className }: React.HTMLAttributes<HTMLElement>) {
        return (
            <div className={className}>
                <div className="max-w-[2000px] m-auto flex py-8 text-white">
                    <Image src={imageUrl} alt="Profile picture" width="110" height="110" className="border border-border shadow-md rounded-sm" />

                    <div className="ml-5 flex flex-col">
                        <div className="flex mt-1 items-baseline">
                            <p className="font-extralight text-3xl tracking-tight">{firstName + " " + lastName}</p>
                            <p className="font-extralight text-lg ml-4">{"@" + handle}</p>
                        </div>

                        <p className="text-md mt-auto">{headline}</p>

                        <div className="flex text-sm mt-auto gap-4">
                            <Link href={"/"}>{1} <span className="font-extralight"> Followers</span></Link>
                            <Link href={"/"}>{1} <span className="font-extralight"> Following</span></Link>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    function Profile({ className }: React.HTMLAttributes<HTMLElement>) {
        return (
            <div className={className}>
                <div className="max-w-[2000px] m-auto ">
                    <Tabs defaultValue="profile" className="flex flex-col">
                        <TabsList className="self-center">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="models">Models</TabsTrigger>
                            <TabsTrigger value="likes">Likes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="mt-4 space-y-6">
                            <ProfileCard />
                            <StatsCard />
                        </TabsContent>
                        <TabsContent value="models">
                            <ModelsCard />
                        </TabsContent>
                        <TabsContent value="likes">
                            <LikesCard />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        );
    }

    function ProfileCard() {
        return (
            <Card className="w-fit border-border shadow-md">
                <CardHeader>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription className="text-md">{aboutMe}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul>
                        <li>
                            <a target="_blank" href="https://twitter.com/" rel="noopener noreferrer" className="align-middle underline hover:text-primary">
                                <LinkedInIcon fontSize="small" />
                                My Linked In
                            </a>
                        </li>
                        <li>
                            <a target="_blank" href="https://twitter.com/" rel="noopener noreferrer" className="align-middle underline hover:text-primary">
                                <TwitterIcon fontSize="small" />
                                Twit twit
                            </a>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        );
    }

    function StatsCard() {
        return (
            <Card className="w-fit border-border shadow-md">
                <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription className="text-md"></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Badge>Blender</Badge>
                    <Badge>Photoshop</Badge>
                </CardContent>
            </Card>
        );
    }

    function ModelsCard() {
        return (
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription className="text-md"></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Badge>Blender</Badge>
                    <Badge>Photoshop</Badge>
                </CardContent>
            </Card>
        );
    }

    function LikesCard() {
        return (
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription className="text-md"></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Badge>Blender</Badge>
                    <Badge>Photoshop</Badge>
                </CardContent>
            </Card>
        );
    }


}