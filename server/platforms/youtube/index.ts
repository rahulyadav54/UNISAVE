import { createYtDlpAdapter } from "../ytdlp-adapter";
import { PLATFORMS } from "@/lib/platforms";

const meta = PLATFORMS.find((p) => p.id === "youtube");
if (!meta) throw new Error("YouTube platform metadata missing");

export const youtubeAdapter = createYtDlpAdapter(meta);
