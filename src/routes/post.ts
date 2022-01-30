import { FastifyPluginCallback } from "fastify";

export const PostHandler: FastifyPluginCallback = (fastify, opts, done) => {
    fastify.get("/post", (req, res) => {
        try {
            res.status(200).send({ hi: "a" })
        } catch {
            res.status(500).send(`Oops.`);
        }
    })
    
    done();
}