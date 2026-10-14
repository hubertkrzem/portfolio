"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const RENDER_PX = 80;          // internal canvas resolution (CSS scales it to `size`)
const CANVAS_SCALE = 4 / 3;    // canvas is larger than the box so the spinning corners aren't clipped
const TEXTURE = "/logo-hk-cube.png";
const SPIN_PERIOD = 14;        // seconds per full 360° turn around Y
const TILT = 0.3;              // max up/down tilt in radians (~17°)
const TILT_PERIOD = 7;         // seconds per full up-and-down tilt cycle

type Props = {
    size: number; // rendered height in px — width matches for the cube
};

export default function CubeLogo({ size }: Props) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let cancelled = false;
        let frame = 0;
        let cleanup = () => {};

        import("three")
            .then((THREE) => {
                if (cancelled) return;

                const scene = new THREE.Scene();

                const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
                camera.position.z = 2.6;

                // Throws if WebGL is unavailable — caught below, fallback logo stays
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(RENDER_PX, RENDER_PX, false);
                renderer.setClearColor(0x000000, 0);
                renderer.domElement.style.width = "100%";
                renderer.domElement.style.height = "100%";
                renderer.domElement.style.display = "block";

                scene.add(new THREE.AmbientLight(0xffffff, 0.35));

                const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
                dirLight.position.set(3, 4, 5);
                scene.add(dirLight);

                const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
                fillLight.position.set(-3, -2, -3);
                scene.add(fillLight);

                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.01 });
                const cube = new THREE.Mesh(geometry, material);
                scene.add(cube);

                const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

                // Continuous 360° spin around Y, with the spin axis tilting up and down on a sine wave.
                // Default Euler order (XYZ) applies the Y spin first, then the X tilt on top.
                const start = performance.now();
                const animate = () => {
                    frame = requestAnimationFrame(animate);
                    const t = (performance.now() - start) / 1000;
                    cube.rotation.y = ((2 * Math.PI * t) / SPIN_PERIOD) % (2 * Math.PI);
                    cube.rotation.x = TILT * Math.sin((2 * Math.PI * t) / TILT_PERIOD);
                    renderer.render(scene, camera);
                };

                // Only swap out the fallback once the texture has actually loaded
                const texture = new THREE.TextureLoader().load(
                    TEXTURE,
                    () => {
                        if (cancelled) return;
                        mount.appendChild(renderer.domElement);
                        setReady(true);
                        if (reduceMotion) {
                            cube.rotation.set(0.4, 0.6, 0);
                            renderer.render(scene, camera);
                        } else {
                            animate();
                        }
                    },
                    undefined,
                    () => cleanup(),
                );
                material.map = texture;

                cleanup = () => {
                    cancelAnimationFrame(frame);
                    geometry.dispose();
                    material.dispose();
                    texture.dispose();
                    renderer.dispose();
                    renderer.domElement.remove();
                };
            })
            .catch(() => {
                // three failed to load or WebGL unsupported — keep the fallback logo
            });

        return () => {
            cancelled = true;
            cleanup();
        };
    }, []);

    return (
        <div
            style={{ height: size, width: ready ? size : undefined }}
            className="relative transition-[height,width] duration-300 ease-in-out"
        >
            {/* 3D cube canvas — oversized and centred so rotation isn't clipped */}
            <div
                ref={mountRef}
                aria-hidden
                style={{ inset: `${-((CANVAS_SCALE - 1) / 2) * 100}%` }}
                className={`absolute pointer-events-none ${ready ? "" : "hidden"}`}
            />

            {/* Fallback: static logo, shown until the cube is ready or if WebGL fails */}
            {!ready && (
                <Image
                    src="/logo-hk.svg"
                    alt="Site logo, black lowercase letters, h and k"
                    width={82}
                    height={63}
                    className="h-full w-auto object-contain cursor-pointer"
                    priority
                />
            )}
            {ready && <span className="sr-only">Site logo, black lowercase letters, h and k</span>}
        </div>
    );
}
