"use server";

import { GogoanimeEpisodes } from "./types";
import { animeVideoLink } from "./requests";

const vidLinksCacher = async (vidData: GogoanimeEpisodes[]) => {
  if (vidData.length > 300) {
    return false;
  }
  const array = Array.from(vidData, (obj) => obj.id);
  try {
    const fetchPromise = array.map(async (element) => {
      await animeVideoLink(element);
    });
    await Promise.all(fetchPromise);
    return true;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export default vidLinksCacher;
