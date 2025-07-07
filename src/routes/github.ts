import axios from "axios";
import { FastifyPluginCallback } from "fastify";
import { logger } from "../app";
import { BasicColors } from "../lib/Colors";
import { Element } from "../lib/Element";
import { JetBrainsMonoCSS } from "../lib/Fonts";

type UserRepoData = {
  public: number;
  private: number;
};

let repoData: UserRepoData = {
  public: 0,
  private: 0,
};

type GithubRepo = { private: boolean; owner: { login: string } };

const getGithubRepos = async (token: string): Promise<false | GithubRepo[]> => {
  const PER_PAGE = 100;
  let page = 1;

  const response: GithubRepo[] = [];

  while (true) {
    const data = await axios
      .get(
        `https://api.github.com/user/repos?page=${page}&per_page=${PER_PAGE}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      )
      .then((req) => req.data as GithubRepo[])
      .catch((err) => {
        console.log(err);
        return false as const;
      });

    if (!data) return false;

    response.push(...data);

    if (data.length < PER_PAGE) break;

    page++;
  }

  return response;
};

const updateRepoData = async () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token)
    return logger.timer("Failed to update repo count, missing GITHUB_TOKEN");

  const data = await getGithubRepos(token);

  if (!data) return;
  const filtered = data.filter((it) => it.owner.login === "Antony1060");

  repoData = {
    public: filtered.filter((it) => !it.private).length,
    private: filtered.filter((it) => it.private).length,
  };
  logger.timer("Updated github repo count", repoData);
};

setInterval(updateRepoData, 10 * 60 * 1000);
setTimeout(updateRepoData, 2000);

export const GithubHandler: FastifyPluginCallback = (fastify, _, done) => {
  fastify.get("/github", (_, res) => {
    const svg = new Element("svg", {
      width: 480,
      height: 120,
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

            .title .github {
                font-size: 24px;
                fill: #6f7174;
            }

            .bottom {
                font-size: 16px;
                opacity: 0.8;
            }

            .bottom .highlight {
                fill: ${BasicColors.blue};
            }

            .bottom .public {
                fill: ${BasicColors.green};
            }

            .bottom .private {
                fill: ${BasicColors.red};
            }
        `);

    svg.addChild(style);

    // background
    svg.addChild(`
            <rect width="480" height="120" fill="url(#bgGradient)"/>
            <linearGradient id="bgGradient" x1="-2.14577e-05" y1="-120" x2="485.72" y2="494.74" gradientUnits="userSpaceOnUse">
                <stop offset="0.109375" stop-color="#0A0D13"/>
                <stop offset="1" stop-color="#282C32"/>
            </linearGradient>
        `);

    svg.addChild(
      new Element("text", {
        x: 45,
        y: 62,
        class: "title",
      })
        .addChild(
          new Element("tspan", { class: "github" }).addChild("github.com/")
        )
        .addChild("antony1060")
    );

    svg.addChild(
      new Element("text", {
        x: 75,
        y: 89,
        class: "bottom",
      })
        .addChild(
          new Element("tspan", { class: "highlight" }).addChild(
            repoData.public + repoData.private + ""
          )
        )
        .addChild(" repos (")
        .addChild(
          new Element("tspan", { class: "public" }).addChild(
            repoData.public + " public"
          )
        )
        .addChild(", ")
        .addChild(
          new Element("tspan", { class: "private" }).addChild(
            repoData.private + " private"
          )
        )
        .addChild(")")
    );

    res
      .status(200)
      .headers({
        "Content-Type": "image/svg+xml",
      })
      .send(svg.render());
  });

  done();
};
