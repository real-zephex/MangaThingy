"use server";

import { supabase } from "./supabase";

export async function WriteData(email: string, manga_data: any) {
  const { data, error } = await supabase.from("history").insert([
    {
      email: email,
      manga: manga_data,
    },
  ]);

  if (error) {
    console.log(error.code);
  }
}

export async function UserLog(email: string, name: string) {
  console.log("Function Called");

  const { data, error } = await supabase.from("users").insert([
    {
      email: email,
      name: name,
    },
  ]);

  if (error && error.code === "23505") {
    return true;
  }
  return false;
}

// const example_json = {
//   name: "Solo Leveling",
//   chapter: 10,
// };

// const temp_mail = "zephex@duck.com";

// async function main() {
//   await WriteData(temp_mail, example_json);
// }

// main();
