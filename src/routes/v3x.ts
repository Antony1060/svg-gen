import { FastifyPluginCallback } from "fastify";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";
import { fetchBase64, formatHref } from "../lib/SvgImg";

const V3XLightLogoAspectRatio = 718 / 204;
const LogoHeight = 42;

export const V3XHandler: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/v3x", async (_, res) => {
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
            <rect width="480" height="120" fill="url(#bgGradient)"/>
            <linearGradient id="bgGradient" x1="-480" y1="-120" x2="5.72021" y2="494.74" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `);

        svg.addChild(
            new Element("image", {
                "xlink:href": formatHref(
                    await fetchBase64(
                        "https://media.antony.red/v3xLight.png"
                    )
                ),
                x: (480 - LogoHeight * V3XLightLogoAspectRatio) / 2,
                y: 24,
                width: LogoHeight * V3XLightLogoAspectRatio,
                height: LogoHeight
            })
        );

        svg.addChild(new Element("text", {
            x: 134,
            y: 89,
            class: "bottom"
        })
            .addChild("Research &amp; Development"));

        res.status(200)
            .headers({
                "Content-Type": "image/svg+xml"
            })
            .send(svg.render());
    })

    done()
}
