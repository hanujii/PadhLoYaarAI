'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

// Dynamically import html2pdf to avoid SSR issues if necessary, 
// though direct import often works if strictly used in client handlers.
// Using 'require' or normal import is fine if we use it inside the handler.

interface DownloadPDFButtonProps {
    targetRef: React.RefObject<HTMLElement | null>;
    filename?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    buttonText?: string;
}

export function DownloadPDFButton({
    targetRef,
    filename = 'download.pdf',
    variant = "outline",
    size = "sm",
    buttonText = "Download PDF"
}: DownloadPDFButtonProps) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!targetRef.current) return;
        setDownloading(true);

        try {
            const html2pdf = (await import('html2pdf.js')).default;

            const element = targetRef.current;
            const opt = {
                margin: [10, 10, 10, 10] as [number, number, number, number], // top, left, bottom, right
                filename: filename,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();

        } catch (error) {
            console.error("PDF Download failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Button variant={variant} size={size} onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {buttonText}
        </Button>
    );
}
