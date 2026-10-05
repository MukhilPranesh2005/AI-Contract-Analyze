import React, { useEffect, useRef } from "react";

/**
 * DnaBackground Component
 * Renders an interactive, 3D-projected white DNA double-helix structures animation
 * against a rich blue background with smooth mouse interaction, physics, and glowing depth.
 */
export default function DnaBackground({
    className = "",
    style = {},
    showFullCover = false,
    interactive = true,
    strandCount = 2,
    particleCount = 45,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        // Track mouse / pointer position for interactive movable effect
        const mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2,
            isHovered: false,
            speedMultiplier: 1,
        };

        const handleResize = () => {
            if (!canvas || !canvas.parentElement) return;
            const dpr = window.devicePixelRatio || 1;
            width = canvas.parentElement.clientWidth || window.innerWidth;
            height = canvas.parentElement.clientHeight || window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
            mouse.isHovered = true;
        };

        const handleMouseLeave = () => {
            mouse.isHovered = false;
        };

        if (interactive) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseleave", handleMouseLeave);
        }

        // Configuration for DNA Strands
        const helices = [
            {
                // Primary prominent DNA Helix
                length: Math.max(width, height) * 1.3,
                baseNodes: 64,
                radius: 46,
                frequency: 0.022,
                speed: 0.02,
                angleOffset: 0,
                centerX: 0.5,
                centerY: 0.5,
                tiltAngle: -0.32,
                primaryColor: "255, 255, 255",
                nodeSize: 3.8,
                rungStep: 2,
                glow: true,
            },
            {
                // Secondary smaller background DNA Helix
                length: Math.max(width, height) * 1.1,
                baseNodes: 48,
                radius: 28,
                frequency: 0.028,
                speed: -0.016,
                angleOffset: Math.PI / 3,
                centerX: 0.82,
                centerY: 0.35,
                tiltAngle: 0.45,
                primaryColor: "235, 245, 255",
                nodeSize: 2.4,
                rungStep: 3,
                glow: false,
            },
            {
                // Third subtle tertiary floating DNA strand
                length: Math.max(width, height) * 0.9,
                baseNodes: 36,
                radius: 20,
                frequency: 0.035,
                speed: 0.014,
                angleOffset: Math.PI / 1.5,
                centerX: 0.18,
                centerY: 0.68,
                tiltAngle: -0.55,
                primaryColor: "220, 240, 255",
                nodeSize: 1.9,
                rungStep: 3,
                glow: false,
            },
        ].slice(0, Math.max(1, strandCount + 1));

        // Ambient floating white molecular particles
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.2 + 0.8,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.6 + 0.2,
            pulseSpeed: Math.random() * 0.03 + 0.01,
            phase: Math.random() * Math.PI * 2,
        }));

        let time = 0;

        // Render Loop
        const render = () => {
            time += 0.025;

            // Smooth mouse inertia
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            const mouseOffsetX = (mouse.x - width / 2) * 0.06;
            const mouseOffsetY = (mouse.y - height / 2) * 0.06;

            // Clear with semi-transparent deep blue gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, width, height);
            bgGradient.addColorStop(0, "#060d24");
            bgGradient.addColorStop(0.4, "#0a1744");
            bgGradient.addColorStop(0.75, "#0e205a");
            bgGradient.addColorStop(1, "#142c75");

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Ambient soft glowing blue orbs for depth
            const orb1 = ctx.createRadialGradient(
                width * 0.25 + mouseOffsetX * 0.5,
                height * 0.35 + mouseOffsetY * 0.5,
                10,
                width * 0.25,
                height * 0.35,
                width * 0.5
            );
            orb1.addColorStop(0, "rgba(26, 68, 175, 0.28)");
            orb1.addColorStop(1, "rgba(6, 13, 36, 0)");
            ctx.fillStyle = orb1;
            ctx.fillRect(0, 0, width, height);

            const orb2 = ctx.createRadialGradient(
                width * 0.75 - mouseOffsetX * 0.5,
                height * 0.7 - mouseOffsetY * 0.5,
                10,
                width * 0.75,
                height * 0.7,
                width * 0.45
            );
            orb2.addColorStop(0, "rgba(45, 110, 235, 0.2)");
            orb2.addColorStop(1, "rgba(6, 13, 36, 0)");
            ctx.fillStyle = orb2;
            ctx.fillRect(0, 0, width, height);

            // 1. Draw floating ambient particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap boundaries
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                const currentAlpha =
                    p.alpha * (0.6 + 0.4 * Math.sin(time * 1.5 + p.phase));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
                ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // 2. Draw 3D DNA Helices
            helices.forEach((helix, hIdx) => {
                const centerPosX = width * helix.centerX + mouseOffsetX * (hIdx === 0 ? 1.2 : 0.6);
                const centerPosY = height * helix.centerY + mouseOffsetY * (hIdx === 0 ? 1.2 : 0.6);

                const rotationAngle = helix.tiltAngle + Math.sin(time * 0.4 + hIdx) * 0.05;
                const cosTilt = Math.cos(rotationAngle);
                const sinTilt = Math.sin(rotationAngle);

                const pointsA = [];
                const pointsB = [];
                const rungs = [];

                const nodeStep = helix.length / helix.baseNodes;
                const startOffset = -helix.length / 2;

                // Calculate 3D points along the double helix
                for (let i = 0; i <= helix.baseNodes; i++) {
                    const along = startOffset + i * nodeStep;
                    const phase = time * helix.speed * 25 + i * helix.frequency * 8 + helix.angleOffset;

                    // 3D coordinates relative to helix axis
                    const rad = helix.radius * (1 + Math.sin(time * 0.8 + i * 0.1) * 0.08);

                    // Strand A
                    const xA_local = rad * Math.cos(phase);
                    const zA_local = rad * Math.sin(phase);
                    const yA_local = along;

                    // Strand B (opposite phase π)
                    const xB_local = rad * Math.cos(phase + Math.PI);
                    const zB_local = rad * Math.sin(phase + Math.PI);
                    const yB_local = along;

                    // Rotate in 2D space along tilt angle + project to 2D
                    const projA = {
                        x: centerPosX + (xA_local * cosTilt - yA_local * sinTilt),
                        y: centerPosY + (xA_local * sinTilt + yA_local * cosTilt),
                        z: zA_local,
                        scale: (zA_local + helix.radius * 2) / (helix.radius * 3) + 0.35,
                        alpha: (zA_local + helix.radius) / (helix.radius * 2) * 0.7 + 0.25,
                        index: i,
                    };

                    const projB = {
                        x: centerPosX + (xB_local * cosTilt - yB_local * sinTilt),
                        y: centerPosY + (xB_local * sinTilt + yB_local * cosTilt),
                        z: zB_local,
                        scale: (zB_local + helix.radius * 2) / (helix.radius * 3) + 0.35,
                        alpha: (zB_local + helix.radius) / (helix.radius * 2) * 0.7 + 0.25,
                        index: i,
                    };

                    pointsA.push(projA);
                    pointsB.push(projB);

                    // Connecting base pair rungs
                    if (i % helix.rungStep === 0) {
                        const midZ = (projA.z + projB.z) / 2;
                        rungs.push({
                            pA: projA,
                            pB: projB,
                            z: midZ,
                            alpha: Math.min(projA.alpha, projB.alpha) * 0.85,
                        });
                    }
                }

                // Combine all elements for correct z-sorting (3D depth layering)
                const renderElements = [];

                // Add rungs
                rungs.forEach((rung) => {
                    renderElements.push({
                        type: "rung",
                        z: rung.z,
                        data: rung,
                    });
                });

                // Add Strand A nodes
                pointsA.forEach((p) => {
                    renderElements.push({
                        type: "nodeA",
                        z: p.z,
                        data: p,
                    });
                });

                // Add Strand B nodes
                pointsB.forEach((p) => {
                    renderElements.push({
                        type: "nodeB",
                        z: p.z,
                        data: p,
                    });
                });

                // Sort by Z (farthest first)
                renderElements.sort((a, b) => a.z - b.z);

                // Draw continuous backbone strands with smooth curves
                const drawBackbone = (points) => {
                    if (points.length < 2) return;
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    for (let i = 1; i < points.length; i++) {
                        const xc = (points[i].x + points[i - 1].x) / 2;
                        const yc = (points[i].y + points[i - 1].y) / 2;
                        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
                    }
                    ctx.strokeStyle = `rgba(${helix.primaryColor}, 0.22)`;
                    ctx.lineWidth = 1.6;
                    ctx.stroke();
                };

                drawBackbone(pointsA);
                drawBackbone(pointsB);

                // Draw sorted elements
                renderElements.forEach((el) => {
                    if (el.type === "rung") {
                        const { pA, pB, alpha } = el.data;
                        ctx.beginPath();
                        ctx.moveTo(pA.x, pA.y);
                        ctx.lineTo(pB.x, pB.y);

                        // Gradient line across base pairs
                        const grad = ctx.createLinearGradient(pA.x, pA.y, pB.x, pB.y);
                        grad.addColorStop(0, `rgba(${helix.primaryColor}, ${pA.alpha * 0.9})`);
                        grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.95})`);
                        grad.addColorStop(1, `rgba(${helix.primaryColor}, ${pB.alpha * 0.9})`);

                        ctx.strokeStyle = grad;
                        ctx.lineWidth = (el.z > 0 ? 2.2 : 1.2) * (helix.glow ? 1.2 : 1.0);
                        ctx.stroke();

                        // Base pair center connecting dot
                        const midX = (pA.x + pB.x) / 2;
                        const midY = (pA.y + pB.y) / 2;
                        ctx.beginPath();
                        ctx.arc(midX, midY, 1.4, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                        ctx.fill();
                    } else {
                        // Draw glowing white DNA node sphere
                        const p = el.data;
                        const size = helix.nodeSize * p.scale;
                        const alpha = Math.max(0.15, Math.min(1, p.alpha));

                        ctx.beginPath();
                        ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);

                        if (helix.glow && p.z > -helix.radius * 0.2) {
                            ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
                            ctx.shadowBlur = 8 * p.scale;
                        } else {
                            ctx.shadowBlur = 0;
                        }

                        // Core bright white gradient
                        const nodeGrad = ctx.createRadialGradient(
                            p.x - size * 0.3,
                            p.y - size * 0.3,
                            size * 0.1,
                            p.x,
                            p.y,
                            size
                        );
                        nodeGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                        nodeGrad.addColorStop(0.7, `rgba(240, 248, 255, ${alpha * 0.85})`);
                        nodeGrad.addColorStop(1, `rgba(${helix.primaryColor}, ${alpha * 0.4})`);

                        ctx.fillStyle = nodeGrad;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                });
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (interactive) {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseleave", handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [interactive, strandCount, particleCount]);

    return (
        <div
            className={`dna-background-container ${className}`}
            style={{
                position: showFullCover ? "fixed" : "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                zIndex: 0,
                pointerEvents: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "auto",
                }}
            />
        </div>
    );
}
