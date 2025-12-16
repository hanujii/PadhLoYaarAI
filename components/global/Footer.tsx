import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-background/95 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <Link
                            href="https://www.linkedin.com/in/ayush-gupta-creative?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Ayush Gupta
                        </Link>
                        . Source code available on{" "}
                        <Link
                            href="https://github.com/hanujii/PadhLoYaarAI.git"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>
                <p className="text-center text-sm text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} plyAI. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
