"use server";

import supabase from "./client";

export async function writeData(name: string, email: string) {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ name: name, email: email }]);

  if (error) {
    return error;
  } else {
    return true;
  }
}
