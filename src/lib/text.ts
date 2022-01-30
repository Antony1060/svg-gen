export const limit = (text: string, chars: number) =>
    text.length <= chars ? text : text.substring(0, chars - 3) + "..."