import { NextRequest, NextResponse } from "next/server";
import { scrapeEbay } from "../../../lib/scrapers/ebay";
import { scrapeNewegg } from "../../../lib/scrapers/newegg";
import { scrapeWalmart } from "../../../lib/scrapers/walmart";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q");
    if (!query) return NextResponse.json([]);

    const scrapers = [
        { name: "eBay", scraper: scrapeEbay },
        { name: "Walmart", scraper: scrapeWalmart },
        { name: "Newegg", scraper: scrapeNewegg },
    ];

    const settled = await Promise.allSettled(scrapers.map((s) => s.scraper(query)));

    const results = settled.flatMap((result, idx) => {
        if (result.status === "fulfilled") {
            return result.value;
        } else {
            return [
                {
                    title: `Failed to scrape ${scrapers[idx].name}`,
                    price: "N/A",
                    url: "N/A",
                    source: scrapers[idx].name,
                    error: true,
                },
            ];
        }
    });

    return NextResponse.json(results);
}
