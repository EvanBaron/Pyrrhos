import { ApplicationCommandRegistries, RegisterBehavior } from "@sapphire/framework";
import { config } from "dotenv";

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

config(process.env.NODE_ENV == "dev" ? { path: ".env.development" } : { path: ".env" });
