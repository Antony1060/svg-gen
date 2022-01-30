import { FunctionHandler } from "."
import { Element } from "../lib/Element"
import { JetBrainsCSS } from "../lib/Fonts";

export const handler: FunctionHandler = async (event, context) => {
    try {
        const svg = new Element("svg", { width: 1200, height: 630 });

        const style = new Element("style");
        style.addChild(`
            ${JetBrainsCSS}

            .bottom-text {
                font-family: "JetBrains Mono", monospace;
                font-size: 32px;
                fill: white;
            }
        `);
        svg.addChild(style);

        // gradient
        svg.addChild(`
            <linearGradient id="bgGradient" x1="0" y1="0" x2="1158.79" y2="698.378" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `)

        // backround
        svg.addChild(new Element("rect", {
            height: 630,
            width: 1200,
            fill: "url(#bgGradient)"
        }));

        // pfp
        svg.addChild(new Element("image", {
            href: "https://media.antony.red/logoTransparent.png",
            x: 10,
            y: 10,
            width: 170,
            height: 170,
        }));

        // bottom text
        svg.addChild(new Element("text", {
            x: 930,
            y: 600,
            class: "bottom-text"
        }).addChild("antony.cloud"))

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/svg+xml"
            },
            body: svg.render()
        }
    } catch {
        return {
            statusCode: 500,
            body: "Oops"
        }
    }
}