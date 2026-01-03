"use client";
import { MangaCard } from "@/components/custom/landing/cards";
import { MangapillService, AsurascansService } from "@/lib/services/manga.actions";
import { Manga } from "@/lib/services/manga.types";
import { useState, useEffect } from "react";

export const Home = () => {
    const [mangapillNewest, setMangapillNewest] = useState<Manga[]>([]);
    const [asurascansPopular, setAsurascansPopular] = useState<Manga[]>([]);
    const [asurascansLatest, setAsurascansLatest] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [newest, popular, latest] = await Promise.all([
                    MangapillService.getNewest(),
                    AsurascansService.getPopular(),
                    AsurascansService.getLatest(),
                ]);

                if (newest?.results) {
                    setMangapillNewest(newest.results);
                }
                if (popular?.results) {
                    setAsurascansPopular(popular.results);
                }
                if (latest?.results) {
                    setAsurascansLatest(latest.results);
                }
            } catch (err) {
                console.error("Error fetching manga data:", err);
                setError("Failed to load manga data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-100">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
                        <p className="text-muted-foreground">Loading manga data...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    {mangapillNewest.length > 0 && (
                        <>
                            <div className="space-y-2 mb-6">
                                <h2 className="text-2xl font-bold">Popular Mangas</h2>
                                <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {mangapillNewest.map((manga, idx) => (
                                    <MangaCard
                                        key={idx}
                                        manga={{ ...manga, source: "mangapill" }}
                                        variant="default" />
                                ))}
                            </div>
                        </>
                    )}

                    {asurascansPopular.length > 0 && (
                        <div className="mt-8">
                            <div className="space-y-2 mb-6">
                                <h2 className="text-2xl font-bold">Popular Mangas (more)</h2>
                                <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {asurascansPopular.map((manga, idx) => (
                                    <MangaCard
                                        key={idx}
                                        manga={{ ...manga, source: "asurascans" }}
                                        variant="featured" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {asurascansLatest.length > 0 && (
                    <div className="col-span-0 md:col-span-1">
                        <div className="space-y-2 mb-6">
                            <h2 className="text-2xl font-bold">Latest Mangas</h2>
                            <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-pink-500 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {asurascansLatest.map((manga, idx) => (
                                <MangaCard
                                    key={idx}
                                    manga={{ ...manga, source: "asurascans" }}
                                    variant="featured" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};
