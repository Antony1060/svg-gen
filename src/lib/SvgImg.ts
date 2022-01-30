import axios from "axios";
import { writeFile } from "fs/promises";

const cache: Record<string, string> = {};

export const fetchBase64 = async (url: string) => {
    if(cache[url]) return cache[url];

    const data = await axios(url, { responseType: "arraybuffer" }).then(res => res.data);
    cache[url] = Buffer.from(data, "binary").toString("base64");
    return cache[url];
}

export const formatHref = (base64: string) =>
    `data:image/png;base64,${base64}`;