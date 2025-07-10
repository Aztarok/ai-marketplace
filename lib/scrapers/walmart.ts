import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapedItem } from "../types/scrapedItem";

export async function scrapeWalmart(query: string) {
    try {
        const searchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
        const res = await axios.get(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0", // Helps avoid bot blocks
            },
        });

        const $ = cheerio.load(res.data);

        const items: ScrapedItem[] = [];

        $("div[data-item-id]")
            .slice(0, 10)
            .each((_, el) => {
                const title = $(el).find("a[aria-label]").attr("aria-label");
                const price = $(el).find("span[data-automation-id='product-price']").first().text();
                const url = "https://www.walmart.com" + $(el).find("a").attr("href");

                if (title && price && url) {
                    items.push({ title, price, url, source: "Walmart" });
                }
            });

        // Force an error if nothing was scraped
        if (items.length === 0) {
            throw new Error("Walmart returned no usable data (likely layout or bot block).");
        }

        return items;
    } catch (err) {
        console.error("Walmart scraper failed:", err);
        throw err;
    }
}
