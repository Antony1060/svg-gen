import { createLogger } from "@lvksh/logger";
import chalk from "chalk";
import fastify from "fastify";
import fastifyCors from "fastify-cors";
import { PostHandler } from "./routes/post";

const DEBUG = !process.env.DISABLE_DEBUG && true;

const logger = createLogger({
    "net": {
        label: chalk.yellow`NET`,
        divider: chalk.gray` | `
    }
}, { padding: "PREPEND" })

const app = fastify();

app.register(fastifyCors);
app.addHook("onRequest", (req, _, next) => {
    DEBUG && logger.net(`${req.method} on ${req.routerPath}`);
    next();
});

app.register(PostHandler, { prefix: "/" });

app.get("/", (_, res) => {
    res.send({ status: 200 });
})

app.listen(process.env.PORT || 8080, "0.0.0.0", (err, addr) => {
    logger.net(`Listening on ${addr}`);
})