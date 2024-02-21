"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CameraControls, Stage } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ModelViewer({
    modelId,
    size
}: {
    modelId: string,
    size:   { width: string, height: string }
}) {
    const [modelUrl, setModelUrl] = useState("");

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/" + Number(modelId))
            .then(res => res.json())
            .then(data => {
                setModelUrl(data.downloadUrl);
            });
    }, []);


    return (
        <ErrorBoundary fallback={
            <div className={`flex justify-center items-center text-center border-2 w-${size.width} h-${size.height}`}>Invalid file format found,<br /> please delete this submission and upload a proper .gltf file!</div>
        }>
            <div className={`w-${size.width} h-${size.height}`}>
                <Canvas shadows className="border-2" camera={{ position: [5, 5, 5], fov: 45 }}>
                    <Suspense fallback={null}>
                        <Scene modelUrl={modelUrl} />
                    </Suspense>
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}

function Scene({ modelUrl }: { modelUrl: string }) {
    const cameraControlsRef = useRef<CameraControls>(null);
    const { camera } = useThree();

    const loader = useLoader(GLTFLoader, modelUrl);

    // useControls({
    //     reset: button(() => cameraControlsRef.current?.reset(true))
    // });

    return (
        <>
            <Stage>
                {/* <LevaControls /> */}
                <primitive object={loader.scene} />
            </Stage>
            <CameraControls />
        </>
    );
}