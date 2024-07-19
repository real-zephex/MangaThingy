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
  const json_data = await JSON.parse(JSON.stringify(data, null, 2));
  return json_data.length == 0 ? json_data : json_data[0].manga;
};
