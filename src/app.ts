import { createLogger, shimLog } from "@lvksh/logger";
import chalk from "chalk";
import fastify from "fastify";
import fastifyCors from "fastify-cors";
import { fetchBase64 } from "./lib/SvgImg";
import { PostHandler } from "./routes/post";

const DEBUG = !process.env.DISABLE_DEBUG;

const logger = createLogger({
    "net": chalk.yellow`NET`,
    "console": chalk.greenBright`CONSOLE`
}, { padding: "PREPEND", divider: chalk.gray` | ` });
shimLog(logger, "console");

// pre-fetch images
((...imgs: string[]) =>
    imgs.forEach(fetchBase64)
)("https://media.antony.red/logoTransparent.png")

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