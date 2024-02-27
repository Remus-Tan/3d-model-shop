import { Model } from "@prisma/client";
import HomeNav from "../_components/home-nav";
import ModelCard from "@/components/shared/model-card";

export default async function Browse() {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models?take=10");
    const models = await response.json();

    return (
        <>
            <HomeNav />
            <p className="pl-8 pt-8 text-2xl font-medium">
                Browse the latest models!
            </p>
            <div className="m-8 flex flex-col gap-4">
                <div className="flex gap-4 flex-wrap">
                    {models.length == 0 && <p>No recent uploads!</p>}
                    {models.length != 0 && models.map((model: Model) => <ModelCard key={model.id} model={model} />)}
                </div>
            </div>
        </>
    );
}