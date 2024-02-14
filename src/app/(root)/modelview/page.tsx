"use client";

import { Suspense, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Center, Environment, Loader, OrbitControls, Stage } from '@react-three/drei';
import { Model } from '@/components/shared/Cone';
import { Leva, button, useControls } from 'leva';
import { Button } from '@/components/ui/button';
import { Euler, Vector3 } from 'three';

function LevaControls() {
    return (
        <>
        </>
    );
}

function Scene() {
    const cameraControlsRef = useRef();
    const { camera } = useThree();

    // camera.position.x = 5;
    // camera.position.y = 5;

    useControls({
        reset: button(() => cameraControlsRef.current?.reset(true))
    });
    return (
        <>
            <LevaControls />
            <Stage

            >
                <Model castShadow />
            </Stage>
            <CameraControls
                ref={cameraControlsRef}
            />
        </>
    );
}

export default function Modelview() {
    return (
        <div className='w-[800px] h-[800px]'>
            <Canvas shadows className='border-2' camera={{ position: [5, 5, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    );
}