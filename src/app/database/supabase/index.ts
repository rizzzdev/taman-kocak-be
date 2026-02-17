import { createClient } from "@supabase/supabase-js";
import { envConfig } from "../../../shared/configs/env.config.js";

export const supabaseClient = createClient(
  envConfig.supabaseUrl!,
  envConfig.supabaseKey!,
);
