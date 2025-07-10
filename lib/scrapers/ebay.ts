import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapedItem } from "../types/scrapedItem";

export async function scrapeEbay(query: string) {
    const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
    const res = await axios.get(searchUrl);
    const $ = cheerio.load(res.data);

    const items: ScrapedItem[] = [];

    $(".s-item")
        .slice(0, 10)
        .each((_, el) => {
            const title = $(el).find(".s-item__title").text();
            const price = $(el).find(".s-item__price").text();
            const url = $(el).find(".s-item__link").attr("href");

            if (title && price && url) {
                items.push({ title, price, url, source: "eBay" });
            }
        });

    return items;
}
