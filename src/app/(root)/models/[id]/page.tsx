import { Metadata, ResolvingMetadata } from "next";
import ModelView from "./_components/model-view";
import { Model, User } from "@prisma/client";

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const previousImages = (await parent).openGraph?.images || [];

    const fetchModel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${params.id}`, { next: { revalidate: 0 } });
    const modelDetails: Model = await fetchModel.json();

    const fetchCreator = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${modelDetails.creatorId}`, { next: { revalidate: 0 } });
    const creatorDetails: User = await fetchCreator.json();

    return {
        title: modelDetails.name + " by " + creatorDetails.firstName + " " + creatorDetails.lastName,
        openGraph: {
            images: [...previousImages],
        },
    };
}

export default function ModelViewPage(
    { params }: { params: { id: string } }
) {
    return <ModelView params={params} />;
}