import { auth } from "@clerk/nextjs";
import SettingsForm from "./_components/settings-forms";
import { Model } from "@prisma/client";
import { redirect } from "next/navigation";

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
        <div className="flex-1 lg:max-w-2xl">
            <SettingsForm defaultValues={model} modelId={params.id}/>
        </div>
    );
}