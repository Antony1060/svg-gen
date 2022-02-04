import axios from "axios";
import { performance } from "node:perf_hooks";
import { logger } from "../app";

const cache: Record<string, string> = {};

export const fetchBase64 = async (url: string) => {
    if (cache[url]) return cache[url];

    logger.console("Fetching new image at", url);

    const start = performance.now();
    const data = await axios(url, { responseType: "arraybuffer" })
        .then((res) => res.data)
        .finally(() =>
            logger.console(
                "Fetch timing",
                url,
                (performance.now() - start).toFixed(2) + "ms"
            )
        );

    cache[url] = Buffer.from(data, "binary").toString("base64");
    return cache[url];
};

export const formatHref = (base64: string) => `data:image/png;base64,${base64}`;
