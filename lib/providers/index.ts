import { espn } from "./espn";
import { apiFootball } from "./apiFootball";
import type { FootballProvider } from "../types";

export const provider: FootballProvider = process.env.DATA_PROVIDER === "api-football" ? apiFootball : espn;
