import { spawnSync } from "child_process";
const args = [
  "--js-runtimes", `"${process.execPath}"`,
  "--print", "title",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
];
console.log(spawnSync("yt-dlp", args, { encoding: "utf8" }).stdout);
