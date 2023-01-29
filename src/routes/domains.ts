import axios from "axios";
import { FastifyPluginCallback } from "fastify";
import { logger } from "../app";
import { BasicColors } from "../lib/Colors";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";
import { deprecate } from "util";

let domainCount = 0;

const updateDomainCount = async () => {
    const data: false | { domains: unknown[] } = await axios.get("https://get.antony.domains/").then(req => req.data).catch(() => false);
    if(!data) return

    domainCount = data.domains.length;
    logger.timer("Updated domain count " + domainCount);
};

// update every 10 minutes
setInterval(updateDomainCount, 10 * 60 * 1000);
setTimeout(updateDomainCount, 2000);

export const DomainsHandler: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/domains", (_, res) => {
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
                fill: ${BasicColors.blue};
            }
        `);

        svg.addChild(style);

        // background
        svg.addChild(`
            <rect width="480" height="120" fill="url(#bgGradient)"/>
            <linearGradient id="bgGradient" x1="-480" y1="-120" x2="5.72021" y2="494.74" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `);

        svg.addChild(new Element("text", {
            x: 88,
            y: 62,
            class: "title"
        }).addChild("antony.domains"));

        svg.addChild(new Element("text", {
            x: 85,
            y: 89,
            class: "bottom"
        })
            .addChild("not so proud owner of ")
            .addChild(new Element("tspan", { class: "highlight" })
                .addChild(domainCount + ""))
            .addChild(" domains"));

        res.status(200)
            .headers({
                "Content-Type": "image/svg+xml"
            })
            .send(svg.render());
    });

    done();
};
