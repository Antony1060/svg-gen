import { FastifyPluginCallback } from "fastify";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";

export const ContactHandler: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/contact", (_, res) => {
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
        `);

        svg.addChild(style);

        // background
        svg.addChild(`
            <rect width="480" height="120" fill="url(#bgGradiend)"/>
            <linearGradient id="bgGradiend" x1="-520" y1="1.27501e-05" x2="-9.2052" y2="634.085" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `);

        svg.addChild(new Element("text", {
            x: 88,
            y: 62,
            class: "title"
        }).addChild("antony.contact"));

        svg.addChild(new Element("text", {
            x: 182,
            y: 89,
            class: "bottom"
        }).addChild("ring ring..."));

        res.status(200)
            .headers({
                "Content-Type": "image/svg+xml"
            })
            .send(svg.render());
    });

    done();
};
