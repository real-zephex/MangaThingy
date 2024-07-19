"use server";

import { supabase } from "./supabase";

export const QueryDatabase = async (email: string) => {
  const { data, error } = await supabase
    .from("history")
    .select("manga")
    .eq("email", email);

  if (error) {
    console.error(error);
    return;
  }
  return data;
};

async function query() {
  const data = await QueryDatabase("zephex0@gmail.com");
  if (data) {
    // Logging the entire data
    const json_data = JSON.parse(JSON.stringify(data, null, 2));
    console.log(json_data[0].manga[0].name);

    // Assuming data is an array of rows, and each row has a `manga` column
    // const mangaArray = data[0]?.manga;
    // if (mangaArray) {
    //   // Logging the manga array
    //   console.log("Manga Array:", JSON.stringify(mangaArray, null, 2));

    //   // Accessing individual manga objects
    //   mangaArray.forEach((manga: any, index: number) => {
    //     console.log(`Manga ${index + 1}:`, JSON.stringify(manga, null, 2));
    //   });
    // } else {
    //   console.log("No manga data found.");
    // }
  }
}

query();
