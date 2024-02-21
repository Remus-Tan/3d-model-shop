"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Center, Environment, Loader, OrbitControls, Stage } from '@react-three/drei';
import { button, useControls } from 'leva';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/firebase';


function LevaControls() {
    return (
        <>
        </>
    );
}

function Scene({ modelUrl }: { modelUrl: string }) {
    const cameraControlsRef = useRef<CameraControls>(null);
    const { camera } = useThree();

    const loader = useLoader(GLTFLoader, modelUrl);

    useControls({
        reset: button(() => cameraControlsRef.current?.reset(true))
    }); 
    return (
        <>
            <LevaControls />
            <Stage>
                <primitive object={loader.scene} />
            </Stage>
            <CameraControls
                ref={cameraControlsRef}
            />
        </>
    );
}

export default function Modelview() {
    const [modelUrl, setModelUrl] = useState("");

    getDownloadURL(ref(storage, 'gs://d-shop-2a072.appspot.com/models/cone'))
        .then(url => setModelUrl(url));

    return (
        <div className='w-[800px] h-[800px]'>
            <Canvas shadows className='border-2' camera={{ position: [5, 5, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Scene modelUrl={modelUrl} />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    );
}