//@ts-nocheck
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CameraControls, Environment, RandomizedLight, SpotLight, Stage, Text } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { button, useControls, Leva } from "leva";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";

export default function ModelViewer({
    modelId,
    sizeClass
}: {
    modelId: string,
    sizeClass: string
}) {
    const [isFetching, setFetching] = useState(true);
    const [modelUrl, setModelUrl] = useState("");
    const pathName = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/" + Number(modelId))
            .then(res => res.json())
            .then(data => {
                setModelUrl(data.downloadUrl);
                setFetching(false);
            });
    }, []);

    if (isFetching) return <Loader />;

    return (
        <ErrorBoundary fallback={
            <div className={`flex justify-center items-center text-center border-2 ${sizeClass}`}>
                Invalid file format found,<br />please delete this submission and upload a proper .gltf file! <br /><br />If you think this is a mistake, try refreshing the page.
            </div>
        }>  
            <div className={sizeClass}>
                <Suspense fallback={<Loader />}>
                    <div className="md:absolute md:z-10 shadow-none m-2">
                        <Leva
                            fill flat hideCopyButton titleBar={false}
                            theme={{
                                colors: {
                                    elevation1: "#874b01",
                                    accent2: "#de8212",
                                }
                            }}
                        />
                    </div>
                    <Canvas
                        shadows
                        gl={{ preserveDrawingBuffer: true }}
                        className="border-2"
                        camera={{ position: [5, 5, 5], fov: 30 }}
                    >
                        <Scene />
                    </Canvas>
                </Suspense>
            </div>
        </ErrorBoundary>
    );

    function Loader() {
        return (
            <div className={`flex flex-col justify-center items-center text-center border-2 ${sizeClass}`}>
                <Loader2 className="animate-spin rounded-full bg-background" size={160} strokeWidth="1" color="orange" />
                Loading...!
            </div>
        );
    }

    function Scene() {
        const gl = useThree((state) => state.gl);
        const cameraControlsRef = useRef<CameraControls>(null);

        var levaObj = {};

        if (pathName.includes("settings")) {
            levaObj = {
                "Background": {
                    options: { Show: true, Hide: false }
                },
                "Environment": {
                    options: {
                        Apartment: "apartment",
                        City: "city",
                        Dawn: "dawn",
                        Forest: "forest",
                        Lobby: "lobby",
                        Night: "night",
                        Park: "park",
                        Studio: "studio",
                        Sunset: "sunset",
                        Warehouse: "warehouse"
                    }
                },
                "Blur": {
                    value: 0.25,
                    min: 0,
                    max: 1
                },
                "Reset Camera": button(() => cameraControlsRef.current?.reset(true)),
                "Save View as Thumbnail": button(async () => {
                    const thumbnailRef = ref(storage, `thumbnails/${modelId}.png`);
                    const blob = await (await fetch(gl.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'))).blob();
                    await uploadBytes(thumbnailRef, blob)
                        .then(async (snapshot) => {
                            const thumbnailUrl = await getDownloadURL(thumbnailRef);

                            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${modelId}`, {
                                method: "PATCH",
                                body: JSON.stringify({
                                    thumbnailUrl
                                })
                            }).then(async (res) => {
                                toast({
                                    title: "Thumbnail saved! ✅"
                                });
                            });;
                        });

                })
            };
        } else {
            levaObj = {
                "Background": {
                    options: { Show: true, Hide: false }
                },
                "Environment": {
                    options: {
                        Apartment: "apartment",
                        City: "city",
                        Dawn: "dawn",
                        Forest: "forest",
                        Lobby: "lobby",
                        Night: "night",
                        Park: "park",
                        Studio: "studio",
                        Sunset: "sunset",
                        Warehouse: "warehouse"
                    }
                },
                "Blur": {
                    value: 0.25,
                    min: 0,
                    max: 1
                },
                "Reset Camera": button(() => cameraControlsRef.current?.reset(true))
            };
        }

        const controls = useControls("", levaObj);

        const loader = useLoader(GLTFLoader, modelUrl);

        return (
            <>
                <Environment
                    background={controls["Background"]}
                    blur={controls["Blur"]}
                    preset={controls["Environment"]}
                />
                <primitive object={loader.scene} /> 
                <CameraControls ref={cameraControlsRef} />
            </>
        );
    };
}

