import { Element } from "./Element";

export const limit = (text: string, chars: number) =>
    text.length <= chars ? text : text.slice(0, Math.max(0, chars - 3)) + "...";

type TextWrappingOptions = {
    wrapAfter: number;
    yShift: number;
    attributes: { x: number; y: number } & { [key: string]: string | number };
};

export const toSvgTextWrapped = (
    text: string,
    { wrapAfter, yShift, attributes }: TextWrappingOptions
): Element => {
    return new Element("text", attributes).addChild(
        text
            .trim()
            .split(" ")
            // eslint-disable-next-line unicorn/no-array-reduce
            .reduce(
                (acc, curr) =>
                    (!!(acc.at(-1)!.length + curr.length + 1 <= wrapAfter
                        ? (acc[acc.length - 1] += curr + " ")
                        : acc.push(curr + " ")) && acc) as string[],
                [""]
            )
            // eslint-disable-next-line unicorn/no-array-reduce
            .reduce(
                (acc, curr, i) =>
                    i == 0
                        ? curr +
                          `<tspan x="${attributes.x}" y="${
                              attributes.y + yShift * (i + 1)
                          }">`
                        : acc +
                          curr +
                          `</tspan><tspan x="${attributes.x}" y="${
                              attributes.y + yShift * (i + 1)
                          }">`,
                ""
            )
            .split("<tspan")
            .slice(0, -1)
            .join("<tspan")
    );
};
