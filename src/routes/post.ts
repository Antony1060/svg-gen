import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { FastifyPluginCallback } from "fastify";
import sharp from "sharp";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";
import { fetchBase64, formatHref } from "../lib/SvgImg";
import { limit } from "../lib/text";

export const PostHandler: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.get("/post", async (req, res) => {
        const query = req.query as any;
        
        try {
            if(!query.post) throw new Error();
            const post = query.post;
            const type = query.type ?? "svg";

            const rss = new XMLParser().parse((await axios.get("https://antony.computer/rss.xml")).data);
            
            const posts = rss.rss.channel.item;
            if(!posts || !Array.isArray(posts)) throw new Error();

            const rssPost: { title: string, description: string } = posts.find(it => {
                const split = it.link.split("/");
                return split[split.length - 1].toLowerCase() === post.toLowerCase();
            });
            if(!rssPost) throw new Error();

            const svg = new Element("svg", { width: 1200, height: 630 });

            const style = new Element("style");
            style.addChild(`
                ${JetBrainsMonoCSS}
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
                "xlink:href": formatHref(await fetchBase64("https://media.antony.red/logoTransparent.png")),
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

            res.status(200).headers({
                "Content-Type": type !== "png" ? "image/svg+xml" : "image/png"
            });

            if(type !== "png") res.send(svg.render());
            else res.send(
                sharp(Buffer.from(svg.render()))
                    .png()
            );
        } catch {
            res.status(500).send(`Oops.`);
        }
    })
    
    done();
}