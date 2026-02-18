import { supabaseClient } from "../../app/database/supabase/index.js";
import { BadRequestError } from "../errors/index.js";

export const imageRemover = async (path: string) => {
  await supabaseClient.storage.from("image").remove([path.slice(1)]);
};
