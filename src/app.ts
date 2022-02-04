import { createLogger, shimLog } from "@lvksh/logger";
import chalk from "chalk";
import fastify from "fastify";
import fastifyCors from "fastify-cors";

import { fetchBase64 } from "./lib/SvgImg";
import { CloudHandler } from "./routes/cloud";
import { PostHandler } from "./routes/post";

const DEBUG = !process.env.DISABLE_DEBUG;

const logger = createLogger(
    {
        net: chalk.yellow`NET`,
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

app.register(PostHandler);
app.register(CloudHandler);

app.get("/", (_, res) => {
    res.send({ status: 200 });
});

app.setErrorHandler((_, __, res) => {
    res.status(500).send("Oops");
});

app.listen(process.env.PORT || 8080, "0.0.0.0", (err, addr) => {
    logger.net(`Listening on ${addr}`);
});
