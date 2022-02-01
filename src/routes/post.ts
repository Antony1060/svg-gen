import { FastifyPluginCallback } from "fastify";
import sharp from "sharp";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";
import { fetchBase64, formatHref } from "../lib/SvgImg";
import { limit, toSvgTextWrapped } from "../lib/text";

export const PostHandler: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.get("/post", async (req, res) => {
        const query = req.query as any;
        
        try {
            if(!query.title || !query.description) throw new Error();
            const title = query.title as string;
            const description = query.description as string;
            const type = query.type ?? "svg";

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
                    fill: white;
                }

                .description {
                    font-family: "JetBrains Mono", monospace;
                    font-size: 32px;
                    fill: #d1d1d3;
                    width: 900px;
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
                x: 20,
                y: 20,
                width: 150,
                height: 150,
            }));

            // bottom text
            svg.addChild(new Element("text", {
                x: 930,
                y: 600,
                class: "bottom-text"
            }).addChild("antony.cloud"));


            // title text
            svg.addChild(new Element("text", {
                x: 180,
                y: 300,
                class: "title",
                "font-size": title.length <= 20 ? 64 : title.length <= 26 ? 56 : 46
            }).addChild(limit(title.trim(), 32)));

            // divider
            svg.addChild(new Element("line", {
                x1: 180,
                y1: 330,
                x2: 1080,
                y2: 330,
                stroke: "#45484d",
                "stroke-width": 2
            }));

            // description text
            svg.addChild(toSvgTextWrapped(description, {
                wrapAfter: 46,
                yShift: 40,
                attributes: {
                    x: 180,
                    y: 370,
                    class: "description"
                }
            }));

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