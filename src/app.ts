import { createLogger, shimLog } from "@lvksh/logger";
import chalk from "chalk";
import fastify from "fastify";
import fastifyCors from "fastify-cors";

import { fetchBase64 } from "./lib/SvgImg";
import { CloudHandler } from "./routes/cloud";
import { DomainsHandler } from "./routes/domains";
import { GithubHandler } from "./routes/github";
import { PostHandler } from "./routes/post";
import { config as dotenvConfig } from "dotenv";
import { WikiHandler } from "./routes/wiki";
dotenvConfig();

const DEBUG = !process.env.DISABLE_DEBUG;

export const logger = createLogger(
    {
        net: chalk.yellow`NET`,
        timer: chalk.redBright`TIMER`,
        console: chalk.greenBright`CONSOLE`
    },
    { padding: "PREPEND", divider: chalk.gray` | ` }
);

shimLog(logger, "console");

// pre-fetch images
// eslint-disable-next-line unicorn/no-array-for-each
((...imgs: string[]) => imgs.forEach(fetchBase64))(
    "https://media.antony.red/logoTransparent.png"
);

const app = fastify();

app.register(fastifyCors);
app.addHook("onRequest", (req, _, next) => {
    DEBUG && logger.net(`${req.method} on ${req.routerPath}`);
    next();
});

app.addHook("onRequest", (_, res, next) => {
    res.header("Cache-Control", "no-cache");

    next();
})

app.register(PostHandler);
app.register(CloudHandler);
app.register(WikiHandler);
app.register(GithubHandler);
app.register(DomainsHandler);

app.get("/", (_, res) => {
    res.send({ status: 200 });
});

app.setErrorHandler((_, __, res) => {
    res.status(500).send("Oops");
});

app.listen(process.env.PORT || 8080, "0.0.0.0", (err, addr) => {
    logger.net(`Listening on ${addr}`);
});
