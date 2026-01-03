import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t bg-background mt-10">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <h2 className="text-lg font-semibold">Otaku Oasis</h2>
                        <p className="text-sm text-muted-foreground">
                            Your ultimate destination for reading manga.
                        </p>
                    </div>

                    <div className="flex gap-6 text-sm font-medium">
                        <Link href="/" className="hover:underline underline-offset-4">
                            Home
                        </Link>
                        <Link href="/browse" className="hover:underline underline-offset-4">
                            Browse
                        </Link>
                        <Link href="/library" className="hover:underline underline-offset-4">
                            Library
                        </Link>
                        <Link href="https://github.com/real-zephex/MangaThingy" target="_blank" className="hover:underline underline-offset-4">
                            GitHub
                        </Link>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Otaku Oasis. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
