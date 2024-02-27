import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Model, User } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Box, Settings } from "lucide-react";
import { currentUser } from "@clerk/nextjs";

export default async function ModelCard(
    { model }: { model: Model }
) {
    const loggedInUser = await currentUser();
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/users/" + model.creatorId);
    const creator = await response.json();

    return (
        <Card className="w-fit rounded-none shadow-md transition-all hover:scale-105 ease-out" key={model.id}>
            <CardContent className="p-0">
                <a href={`/models/${model.id}`}>
                    <div className="w-96 h-64">
                        {model.thumbnailUrl ?
                            <Image src={model.thumbnailUrl} alt="Thumbnail" width={384} height={256} />
                            :
                            <div className="w-[384px] h-[256px] flex justify-center items-center">
                                <Box width={64} height={64} />
                            </div>
                        }
                    </div>
                </a >
            </CardContent>
            <CardFooter className="p-2 flex gap-2 items-center">
                <a href={"/user/profile/" + creator.handle}><Image src={creator.imageUrl} alt="Profile Picture" width={24} height={24} /></a>
                <a href={"/models/" + model.id} className="hover:text-primary">{model.name ? model.name : "Unnamed Model"}</a>

                <div className="ml-auto flex gap-2 items-center">
                    <p className="text-sm text-muted-foreground">Uploaded {new Date(model.createdAt).toLocaleDateString()}</p>
                        {loggedInUser && (model.creatorId == loggedInUser.id) &&
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger className="hover:animate-spin duration-1000 ease-out">
                                    <a href={`/models/${model.id}/settings`}>
                                        <Settings />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent className="bg-stone-700 text-white border-none">
                                    Settings
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    }
                </div>
            </CardFooter>
        </Card >
    );
}