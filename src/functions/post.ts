import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { FunctionHandler } from "."
import { Element } from "../lib/Element"
import { JetBrainsCSS } from "../lib/Fonts";
import { limit } from "../lib/text";

export const handler: FunctionHandler = async (event, context) => {
    const { post } = event.queryStringParameters;

    try {
        if(!post) throw new Error();

        const rss = new XMLParser().parse((await axios.get("https://antony.computer/rss.xml")).data);
        
        const posts = rss.rss.channel.item;
        if(!posts || !Array.isArray(posts)) throw new Error();

        const rssPost: { title: string, description: string } = posts.find(it => it.link.split("/").at(-1) === post);
        if(!rssPost) throw new Error();

        const svg = new Element("svg", { width: 1200, height: 630 });

        const style = new Element("style");
        style.addChild(`
            ${JetBrainsCSS}

            .bottom-text {
                font-family: "JetBrains Mono", monospace;
                font-size: 32px;
                fill: white;
            }

            .title {
                font-family: "JetBrains Mono", monospace;
                font-size: 48px;
                fill: white;
            }

            .description {
                font-family: "JetBrains Mono", monospace;
                font-size: 32px;
                fill: #d1d1d3;
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
        }).addChild("antony.cloud"));


        // title text
        svg.addChild(new Element("text", {
            x: 200,
            y: 280,
            class: "title"
        }).addChild(limit(rssPost.title.trim(), 30)));

        // divider
        svg.addChild(new Element("line", {
            x1: 200,
            y1: 310,
            x2: 1080,
            y2: 310,
            stroke: "#45484d"
        }));

        // description text
        svg.addChild(new Element("text", {
            x: 200,
            y: 350,
            class: "description"
        }).addChild(limit(rssPost.description.trim(), 46)));

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