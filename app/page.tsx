"use client";

import { useState } from "react";
import { ScrapedItem } from "../lib/types/scrapedItem";

export default function HomePage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ScrapedItem[]>([]);

    const search = async () => {
        const res = await fetch("/api/search?q=" + encodeURIComponent(query));
        const data = await res.json();
        console.log(data);
        setResults(data);
    };

    return (
        <main className="p-4">
            <h1 className="text-2xl mb-4">AI-Powered Price Finder</h1>
            <div className="flex gap-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for an item..."
                    className="border p-2 w-full"
                />
                <button onClick={search} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Search
                </button>
            </div>
            <div className="mt-6">
                {results.map((item, i) => (
                    <div key={i} className="border p-4 mb-2 rounded">
                        <h2 className="font-bold">{item.title}</h2>
                        <p>Price: {item.price}</p>
                        <a href={item.url} target="_blank" className="text-blue-600 underline">
                            View Item
                        </a>
                    </div>
                ))}
            </div>
        </main>
    );
}
