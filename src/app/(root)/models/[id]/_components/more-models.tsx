import ModelCard from "@/components/shared/model-card";
import { Separator } from "@/components/ui/separator";
import { Model } from "@prisma/client";

export default async function MoreModels({ searchvalue, currentModel }: { searchvalue: string, currentModel: number }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/search/${searchvalue}/?take=5`);
    const models = await response.json();

    const fallbackResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models?take=5`);
    const fallbackModels = await fallbackResponse.json();

    return (
        <>
            <Separator orientation="vertical" className="w-2 h-auto my-4" />
            <div className="flex flex-col gap-4 items-center w-1/4">
                <p className="text-xl font-semibold">Other Suggested Models</p>

                {models.length > 1 && models.map((model: Model) => (
                    model.id != currentModel && <ModelCard key={model.id} model={model} />
                ))}

                {models.length <= 1 && fallbackModels.map((model: Model) => (
                    model.id != currentModel && <ModelCard key={model.id} model={model} />
                ))}
            </div>
        </>
    );
}