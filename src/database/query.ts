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
