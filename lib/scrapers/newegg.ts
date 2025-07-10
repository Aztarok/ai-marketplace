import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapedItem } from "../types/scrapedItem";

export async function scrapeNewegg(query: string) {
    const searchUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(query)}`;
    const res = await axios.get(searchUrl);
    const $ = cheerio.load(res.data);

    const items: ScrapedItem[] = [];

    $(".item-cell")
        .slice(0, 10)
        .each((_, el) => {
            const title = $(el).find(".item-title").text();
            const price = $(el).find(".price-current").text().trim();
            const url = $(el).find(".item-title").attr("href");

            if (title && price && url) {
                items.push({ title, price, url, source: "Newegg" });
            }
        });

    return items;
}
