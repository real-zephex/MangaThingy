import axios from "axios";
import * as cheerio from "cheerio";
import {
  ScraperResponse,
  AsuraScansSearchResult,
  AsuraScansInfo,
} from "./types";

export class Asurascans {
  private proxyUrl = "https://sup-proxy.zephex0-f6c.workers.dev/api-text?url=";
  private parentUrl = "https://asurascans.io";

  async search(
    query: string,
  ): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/?s=${query}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $(
        "#content > div > div.postbody > div > div.listupd > div > div.bsx",
      );

      const results: AsuraScansSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const title = $card.find("a").attr("title") || "";
          const href = $card.find("a").attr("href") || "";
          const id = href.split("/").slice(-2, -1)[0] || "";
          const image =
            $card
              .find(
                "img.ts-post-image.wp-post-image.attachment-medium.size-medium",
              )
              .attr("src") || "";
          const chapters = $card.find("div.epxs").text() || "";

          results.push({
            title,
            id,
            image,
            chapters,
          });
        } catch (error) {
          console.warn("[Asurascans Search] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Asurascans Search] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async info(id: string): Promise<ScraperResponse<AsuraScansInfo>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/manga/${id}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);

      const image =
        $(
          "div.seriestucon > div.seriestucontent > div.seriestucontl > div.thumb > img",
        ).attr("data-src") || "";
      const description =
        $(
          "div.seriestucon > div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.entry-content.entry-content-single > p",
        ).text() || "";

      const infoSelector = $(
        "div.seriestucon > div.seriestucontent > div.seriestucontentr > div.seriestucont > div > table > tbody",
      );
      const title = $("div.seriestucon > div.seriestuheader > h1").text() || "";

      const status =
        infoSelector.find("tr:nth-child(1) > td:nth-child(2)").text() || "";
      const type = $("tr:nth-child(2) > td:nth-child(2)").text() || "";
      const year = $("tr:nth-child(3) > td:nth-child(2)").text() || "";

      const authorText = $("tr:nth-child(4) > td:nth-child(2)").text() || "";
      const author = authorText.split(",").map((a) => a.trim());

      const artistsText = $("tr:nth-child(5) > td:nth-child(2)").text() || "";
      const artists = artistsText.split(",").map((a) => a.trim());

      const serializationText =
        $("tr:nth-child(6) > td:nth-child(2)").text() || "";
      const serialization = serializationText.split(",").map((s) => s.trim());

      const genresSelector = $(
        "div.seriestucon > div.seriestucontent > div.seriestucontentr > div.seriestucont > div > div > a",
      );
      const genres = genresSelector
        .map((_, el) => $(el).text())
        .get()
        .join(", ");

      const chapterSelector = $("#chapterlist > ul > li > div > div");
      const chapters = chapterSelector
        .map((_, element) => {
          const $ch = $(element);
          const chapterTitle = $ch.find("span.chapternum").text() || "";
          const chapterDate = $ch.find("span.chapterdate").text() || "";
          const href = $ch.find("a").attr("href") || "";
          const chapterId = href.split("/").slice(-2, -1)[0] || "";

          return {
            title: chapterTitle,
            date: chapterDate,
            id: chapterId,
          };
        })
        .get();

      return {
        status: response.status,
        results: {
          id,
          title,
          image,
          description,
          status,
          type,
          year,
          author,
          artists,
          serialization,
          genres,
          chapters,
        },
      };
    } catch (error) {
      console.error("[Asurascans Info] Error:", error);
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

      const imgSelector = $("#readerarea > p > img");
      const images = imgSelector
        .map((_, el) => $(el).attr("data-src") || "")
        .get();

      return {
        status: response.status,
        results: images,
      };
    } catch (error) {
      console.error("[Asurascans Pages] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async popular(): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $(
        "#content > div > div.hotslid > div > div.listupd.popularslider > div > div > div.bsx",
      );

      const results: AsuraScansSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const title = $card.find("a").attr("title") || "";
          const href = $card.find("a").attr("href") || "";
          const id = href.split("/").slice(-2, -1)[0] || "";
          const image =
            $card
              .find(
                "img.ts-post-image.wp-post-image.attachment-medium.size-medium",
              )
              .attr("data-src") || "";
          const chapters = $card.find("div.epxs").text() || "";

          results.push({
            title,
            id,
            image,
            chapters,
          });
        } catch (error) {
          console.warn("[Asurascans Popular] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Asurascans Popular] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async latest(
    page: string = "1",
  ): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/manga/?page=${page}&order=update`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $(
        "#content > div > div.postbody > div.bixbox.seriesearch > div.mrgn > div.listupd > div > div.bsx",
      );

      const results: AsuraScansSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const title = $card.find("a").attr("title") || "";
          const href = $card.find("a").attr("href") || "";
          const id = href.split("/").slice(-2, -1)[0] || "";
          const image =
            $card
              .find(
                "img.ts-post-image.wp-post-image.attachment-medium.size-medium",
              )
              .attr("data-src") || "";
          const chapters = $card.find("div.epxs").text() || "";

          results.push({
            title,
            id,
            image,
            chapters,
          });
        } catch (error) {
          console.warn("[Asurascans Latest] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Asurascans Latest] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async genres(
    type: string,
  ): Promise<ScraperResponse<AsuraScansSearchResult[]>> {
    try {
      const url = `${this.proxyUrl}${this.parentUrl}/genres/${type}`;
      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const cards = $(
        "#content > div > div > div > div.listupd > div > div.bsx",
      );

      const results: AsuraScansSearchResult[] = [];

      cards.each((_, element) => {
        try {
          const $card = $(element);
          const title = $card.find("a").attr("title") || "";
          const href = $card.find("a").attr("href") || "";
          const id = href.split("/").slice(-2, -1)[0] || "";
          const image =
            $card
              .find(
                "img.ts-post-image.wp-post-image.attachment-medium.size-medium",
              )
              .attr("src") || "";
          const chapters = $card.find("div.epxs").text() || "";

          results.push({
            title,
            id,
            image,
            chapters,
          });
        } catch (error) {
          console.warn("[Asurascans Genres] Error parsing card:", error);
        }
      });

      return {
        status: response.status,
        results,
      };
    } catch (error) {
      console.error("[Asurascans Genres] Error:", error);
      return {
        status: 500,
        results: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
