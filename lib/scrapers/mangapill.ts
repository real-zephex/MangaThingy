import axios from "axios";
import * as cheerio from "cheerio";
import { ScraperResponse, MangaSearchResult, MangaInfo } from "./types";

export class Mangapill {
  private proxyUrl = "https://sup-proxy.zephex0-f6c.workers.dev/api-text?url=";
  private parentUrl = "https://mangapill.com";

  async search(query: string): Promise<ScraperResponse<MangaSearchResult[]>> {
    try {
      const newQuery = query.replace(/ /g, "+");
      const url = `${this.proxyUrl}${this.parentUrl}/search?q=${newQuery}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $(
        "body > div.container.py-3 > div.my-3.grid.justify-end.gap-3.grid-cols-2 > div",
      );

      const results: MangaSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const id = $card.find("a.relative.block").attr("href") || "";
          const title =
            $card
              .find("div.mt-3.font-black.leading-tight.line-clamp-2")
              .text() || "";
          const subheading =
            $card.find("div.line-clamp-2.text-xs.text-secondary.mt-1").text() ||
            "?";
          const image =
            $card
              .find("a.relative.block")
              .find("figure")
              .find("img")
              .attr("data-src") || "";

          const genresSelector = $card
            .find("div.flex.flex-wrap.gap-1.mt-1")
            .find("div");
          const type = genresSelector.eq(0).text() || "";
          const year = genresSelector.eq(1).text() || "";
          const status = genresSelector.eq(2).text() || "";

          results.push({
            id,
            title,
            subheading,
            image,
            type,
            year,
            status,
          });
        } catch (error) {
          console.warn("[Mangapill Search] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Mangapill Search] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async info(id: string): Promise<ScraperResponse<MangaInfo>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/${id}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);

      const image =
        $(
          "body > div.container > div.flex.flex-col > div.text-transparent.flex-shrink-0.w-60.h-80.relative.rounded.bg-card.mr-3.mb-3 > img",
        ).attr("data-src") || "";
      const title =
        $(
          "body > div.container > div.flex.flex-col > div.flex.flex-col > div:nth-child(1) > h1",
        ).text() || "";
      const description =
        $(
          "body > div.container > div.flex.flex-col > div.flex.flex-col > div:nth-child(2) > p",
        ).text() || "";
      const type =
        $(
          "body > div.container > div.flex.flex-col > div.flex.flex-col > div.grid.grid-cols-1 > div:nth-child(1) > div",
        ).text() || "";
      const status =
        $(
          "body > div.container > div.flex.flex-col > div.flex.flex-col > div.grid.grid-cols-1 > div:nth-child(2) > div",
        ).text() || "";
      const year =
        $(
          "body > div.container > div.flex.flex-col > div.flex.flex-col > div.grid.grid-cols-1 > div:nth-child(3) > div",
        ).text() || "";

      const genresSelector = $(
        "body > div.container > div.flex.flex-col > div.flex.flex-col > div:nth-child(4) > a",
      );
      const genres = genresSelector.map((_, el) => $(el).text()).get();

      const chapterSelector = $("#chapters > div > a");
      const chapters = chapterSelector
        .map((_, el) => {
          const $ch = $(el);
          return {
            title: $ch.text() || "",
            id: $ch.attr("href") || "",
          };
        })
        .get()
        .reverse();

      return {
        status: response.status,
        results: {
          id,
          title,
          image,
          description,
          type,
          status,
          year,
          genres,
          chapters,
        },
      };
    } catch (error) {
      console.error("[Mangapill Info] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async pages(id: string): Promise<ScraperResponse<string[]>> {
    try {
      const cleanId = id.startsWith("/") ? id : `/${id}`;
      const url = `${this.proxyUrl}${this.parentUrl}${cleanId}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);

      const imageSelector = $(
        "body > div > chapter-page > div > div.relative.bg-card.flex.justify-center.items-center > picture > img",
      );

      const images = imageSelector
        .map((_, el) => $(el).attr("data-src") || "")
        .get();

      return {
        status: response.status,
        results: images,
      };
    } catch (error) {
      console.error("[Mangapill Pages] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async new(): Promise<ScraperResponse<MangaSearchResult[]>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/mangas/new`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $(
        "body > div.container.py-3 > div.grid.justify-end.gap-3.grid-cols-2 > div",
      );

      const results: MangaSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const id = $card.find("a.relative.block").attr("href") || "";
          const title =
            $card
              .find("div.mt-3.font-black.leading-tight.line-clamp-2")
              .text() || "";
          const subheading =
            $card.find("div.line-clamp-2.text-xs.text-secondary.mt-1").text() ||
            "?";
          const image =
            $card
              .find("a.relative.block")
              .find("figure")
              .find("img")
              .attr("data-src") || "";

          const genresSelector = $card
            .find("div.flex.flex-wrap.gap-1.mt-1")
            .find("div");
          const type = genresSelector.eq(0).text() || "";
          const year = genresSelector.eq(1).text() || "";
          const status = genresSelector.eq(2).text() || "";

          results.push({
            id,
            title,
            subheading,
            image,
            type,
            year,
            status,
          });
        } catch (error) {
          console.warn("[Mangapill New] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Mangapill New] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async recent(): Promise<ScraperResponse<MangaSearchResult[]>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/chapters`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $("body > div.container.py-3 > div.grid.grid-cols-2 > div");

      const results: MangaSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const id =
            $card
              .find("div.px-1")
              .find("a.mt-1\\.5.leading-tight.text-secondary")
              .attr("href") || "";
          const image =
            $card.find("a").find("figure").find("img").attr("data-src") || "";
          const title =
            $card
              .find("div.px-1")
              .find("a.mt-1\\.5.leading-tight.text-secondary")
              .find("div.line-clamp-2.text-sm.font-bold")
              .text() || "";

          results.push({
            id,
            image,
            title,
          });
        } catch (error) {
          console.warn("[Mangapill Recent] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Mangapill Recent] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
