"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Loader2, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareResultProps {
    targetRef: React.RefObject<HTMLElement>;
    fileName?: string;
    title?: string;
    text?: string;
}

export function ShareResult({ targetRef, fileName = 'padhloyaar-result.png', title = 'My Result', text = 'Check out my result from PadhLoYaarAI!' }: ShareResultProps) {
    const [sharing, setSharing] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleShare = async () => {
        if (!targetRef.current) return;
        setSharing(true);

        try {
            const canvas = await html2canvas(targetRef.current, {
                useCORS: true,
                backgroundColor: null, // Transparent background if possible, or matches theme
                scale: 2, // Retína quality
            });

            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error("Correction failed");

            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: title,
                    text: text,
                    files: [file],
                });
            } else {
                // Fallback to clipboard or simplified share
                alert("Web Share API not supported on this device. Downloading image instead.");
                handleDownload();
            }
        } catch (error) {
            console.error("Share failed:", error);
        } finally {
            setSharing(false);
        }
    };

    const handleDownload = async () => {
        if (!targetRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(targetRef.current, {
                useCORS: true,
                scale: 2,
            });
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} disabled={sharing || downloading}>
                {sharing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={sharing || downloading}>
                {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                Save Image
            </Button>
        </div>
    );
}
