'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useHistoryStore } from '@/lib/history-store';
import { useTheme } from 'next-themes';
import { truncate } from 'fs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, Maximize2, ExternalLink } from 'lucide-react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3DNoSSR = dynamic(() => import('react-force-graph-3d'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-primary animate-pulse">Initializing Galaxy...</div>
});

export const GalaxyViewer = () => {
    const { history } = useHistoryStore();
    const { theme } = useTheme();
    const router = useRouter();
    const graphRef = useRef<any>(null);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Handle Resize
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });

            const handleResize = () => {
                setDimensions({ width: window.innerWidth, height: window.innerHeight });
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Transform History into Graph Data
    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const existingNodes = new Set();

        // 1. Create a center "You" node
        nodes.push({ id: 'root', name: 'Knowledge Core', val: 20, color: '#facc15', type: 'core' });
        existingNodes.add('root');

        // 2. Create Tool Clusters
        const tools = Array.from(new Set(history.map(h => h.tool)));
        tools.forEach(tool => {
            if (!existingNodes.has(tool)) {
                nodes.push({ id: tool, name: tool, val: 10, color: '#a855f7', type: 'tool' });
                existingNodes.add(tool);
                links.push({ source: 'root', target: tool });
            }
        });

        // 3. Create History Item Nodes
        history.forEach(item => {
            if (!existingNodes.has(item.id)) {
                nodes.push({
                    id: item.id,
                    name: item.query.substring(0, 30) + (item.query.length > 30 ? '...' : ''),
                    fullQuery: item.query,
                    result: item.result,
                    val: 5,
                    color: '#60a5fa',
                    type: 'item',
                    timestamp: item.timestamp
                });
                existingNodes.add(item.id);

                // Link to its tool
                links.push({ source: item.tool, target: item.id });
            }
        });

        return { nodes, links };
    }, [history]);

    const handleNodeClick = (node: any) => {
        if (node.type === 'item') {
            setSelectedNode(node);
            // Fly to node
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            if (graphRef.current) {
                graphRef.current.cameraPosition(
                    { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                    node, // lookAt ({ x, y, z })
                    3000  // ms transition duration
                );
            }
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">

            {/* 3D Graph */}
            <ForceGraph3DNoSSR
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                nodeLabel="name"
                nodeAutoColorBy="type"
                linkWidth={0.5}
                linkColor={() => "#4c1d95"} // Deep purple links
                linkDirectionalParticles={4}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={d => 0.002}
                backgroundColor="#000000"
                showNavInfo={false}
                onNodeClick={handleNodeClick}
                onEngineStop={() => {
                    // Initialize Starfield once engine stabilizes (or just run once on mount via ref)
                    if (graphRef.current) {
                        const scene = graphRef.current.scene();
                        // Add Ambient Light
                        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                        scene.add(ambientLight);
                        // Add Directional Light
                        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
                        dirLight.position.set(100, 100, 100);
                        scene.add(dirLight);

                        // Add Stars
                        const starGeometry = new THREE.BufferGeometry();
                        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
                        const starVertices = [];
                        for (let i = 0; i < 5000; i++) {
                            const x = (Math.random() - 0.5) * 2000;
                            const y = (Math.random() - 0.5) * 2000;
                            const z = (Math.random() - 0.5) * 2000;
                            starVertices.push(x, y, z);
                        }
                        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
                        const stars = new THREE.Points(starGeometry, starMaterial);
                        scene.add(stars);
                    }
                }}
                nodeThreeObject={(node: any) => {
                    const group = new THREE.Group();

                    // Configuration
                    let colorStr = node.color;
                    let size = node.val;

                    // Custom Colors for Realism
                    if (node.type === 'core') { colorStr = '#fbbf24'; size = 12; } // Sun-like
                    if (node.type === 'tool') { colorStr = '#a78bfa'; size = 6; }  // Nebula-like
                    if (node.type === 'item') { colorStr = '#38bdf8'; size = 3; }  // Star-like

                    const color = new THREE.Color(colorStr);

                    // 1. Core Sphere (The Planet/Star itself)
                    const geometry = new THREE.SphereGeometry(size, 32, 32);
                    const material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: 0.4,
                        metalness: 0.8,
                        emissive: color,
                        emissiveIntensity: 0.2
                    });
                    const sphere = new THREE.Mesh(geometry, material);
                    group.add(sphere);

                    // 2. Atmosphere Glow (Sprite)
                    // Create a soft glow texture canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const context = canvas.getContext('2d');
                    if (context) {
                        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
                        gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1)`);
                        gradient.addColorStop(0.4, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.2)`);
                        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        context.fillStyle = gradient;
                        context.fillRect(0, 0, 64, 64);
                    }
                    const texture = new THREE.CanvasTexture(canvas);
                    const spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                        color: color,
                        transparent: true,
                        blending: THREE.AdditiveBlending
                    });
                    const sprite = new THREE.Sprite(spriteMaterial);
                    sprite.scale.set(size * 4, size * 4, 1); // Glow is larger than sphere
                    group.add(sprite);

                    // 3. Ring (Saturn-like) for 'Tool' nodes only
                    if (node.type === 'tool') {
                        const ringGeo = new THREE.RingGeometry(size * 1.4, size * 1.8, 32);
                        const ringMat = new THREE.MeshBasicMaterial({
                            color: color,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.3
                        });
                        const ring = new THREE.Mesh(ringGeo, ringMat);
                        ring.rotation.x = Math.PI / 2;
                        group.add(ring);
                    }

                    return group;
                }}
            />

            {/* Overlay UI */}
            <div className="absolute top-24 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 drop-shadow-[0_2px_10px_rgba(139,92,246,0.3)]">
                    Knowledge Galaxy
                </h1>
                <p className="text-muted-foreground/80 mt-2 max-w-sm">
                    Explore your learning journey as a constellations of ideas. Click notes to revisit them.
                </p>
            </div>

            {/* Instruction Footer */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-xs pointer-events-none bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                Left Click: Rotate • Right Click: Pan • Scroll: Zoom • Click Node: View Details
            </div>

            {/* Details Dialog */}
            <Dialog open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
                <DialogContent className="max-w-xl max-h-[80vh] flex flex-col glass border-primary/20 bg-black/80 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl text-primary">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {selectedNode?.name}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedNode?.fullQuery}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative flex-1 overflow-y-auto min-h-[200px] border border-white/10 rounded-md p-4 bg-white/5">
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                            {selectedNode?.result}
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={() => setSelectedNode(null)}>Close</Button>
                        <Button onClick={() => router.push('/history')}>View in History</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
