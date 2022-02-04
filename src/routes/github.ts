import { FastifyPluginCallback } from "fastify";
import { BasicColors } from "../lib/Colors";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";

export const GithubHandler: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/github", (_, res) => {
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

            .title .github {
                font-size: 24px;
                fill: #6f7174;
            }

            .bottom {
                font-size: 16px;
                opacity: 0.8;
            }

            .bottom .highlight {
                fill: ${BasicColors.blue};
            }

            .bottom .public {
                fill: ${BasicColors.green};
            }

            .bottom .private {
                fill: ${BasicColors.red};
            }
        `);

        svg.addChild(style);

        // background
        svg.addChild(`
            <rect width="480" height="120" fill="url(#bgGradiend)"/>
            <linearGradient id="bgGradiend" x1="-480" y1="-120" x2="5.72021" y2="494.74" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `);

        svg.addChild(new Element("text", {
            x: 45,
            y: 62,
            class: "title"
        })
            .addChild(new Element("tspan", { class: "github" })
                .addChild("github.com/"))
            .addChild("antony1060"));

        svg.addChild(new Element("text", {
            x: 75,
            y: 89,
            class: "bottom"
        })
            .addChild(new Element("tspan", { class: "highlight" })
                .addChild(43 + ""))
            .addChild(" repos (")
            .addChild(new Element("tspan", { class: "public" })
                .addChild(12 + " public"))
            .addChild(", ")
            .addChild(new Element("tspan", { class: "private" })
                .addChild(31 + " private"))
            .addChild(")"));

        res.status(200)
            .headers({
                "Content-Type": "image/svg+xml"
            })
            .send(svg.render());
    });

    done();
};
