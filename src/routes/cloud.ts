import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { FastifyPluginCallback } from "fastify";

import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";

let postCount = 0;

const updatePostCount = async () => {
    const raw: false | string = await axios.get("https://antony.cloud/rss.xml").then((req) => req.data).catch(() => false);
    if (!raw) return;

    try {
        const parsed = new XMLParser().parse(raw) as {
            rss?: { channel?: { item?: unknown[] | unknown } };
        };

        const item = parsed.rss?.channel?.item;

        postCount = Array.isArray(item) ? item.length : 1;
        console.log("Updated cloud post count " + postCount);
        // eslint-disable-next-line no-empty
    } catch {}
};

// update every 10 minutes
setInterval(updatePostCount, 10 * 60 * 1000);
updatePostCount();

export const CloudHandler: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/cloud", (_, res) => {
        const svg = new Element("svg", {
            width: 480,
            height: 120
        });

        const style = new Element("style");

        style.addChild(`
            ${JetBrainsMonoCSS}

            text {
                font-family: "JetBrains Mono", monospace;
                fill: white;
            }

            .title {
                font-size: 36px;
            }

            .bottom {
                font-size: 16px;
                opacity: 0.8;
            }

            .bottom .highlight {
                fill: #54C1FE;
            }
        `);

        svg.addChild(style);

        // background
        svg.addChild(`
            <rect width="480" height="120" fill="url(#bgGradiend)"/>
            <linearGradient id="bgGradiend" x1="0" y1="0" x2="485.72" y2="614.74" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `);

        svg.addChild(new Element("text", {
            x: 110,
            y: 62,
            class: "title"
        }).addChild("antony.cloud"));

        svg.addChild(new Element("text", {
            x: postCount == 1 ? 215 : 207,
            y: 89,
            class: "bottom"
        })
            .addChild(new Element("tspan", { class: "highlight" }).
                addChild(postCount + ""))
            .addChild(postCount == 1 ? " post" : " posts"));

        res.status(200)
            .headers({
                "Content-Type": "image/svg+xml"
            })
            .send(svg.render());
    });

    done();
};
