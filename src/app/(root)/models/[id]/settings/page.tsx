import { auth } from "@clerk/nextjs";
import SettingsForm from "./_components/settings-forms";
import { Model } from "@prisma/client";
import { redirect } from "next/navigation";
import ModelViewer from "./_components/model-viewer";

export default async function Settings(
    { params }: { params: { id: string } }
) {
    const user = auth();

    const model: Model = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${params.id}`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                redirect(`/models/${params.id}`);
            }
        });

    if (user.userId != model.creatorId) {
        redirect(`/models/${params.id}`);
    }
    
    return (
        <div className="m-auto lg:max-w-6xl flex mt-4">
            <ModelViewer modelId={params.id} size={{ width: "[600px]", height: "[600px]" }} />
            <SettingsForm defaultValues={model} modelId={params.id} />
        </div>
    );
}