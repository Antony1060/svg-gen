export class Element {

    children: (Element | string)[];
    tag: string;
    attributes: {[key: string]: string | number};

    constructor(tag: string, attributes: { [key: string]: string | number } = {}) {
        this.tag = tag;
        this.attributes = Object.assign({ xmlns: "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink" }, attributes);
        this.children = [];
    }

    render() {
        return `<${this.tag} ${Object.keys(this.attributes).map((a) => `${a}=\"${this.attributes[a]}\"`).join(' ')}>${this.children.map((a) => typeof a === 'string' ? a : a.render()).join('')}</${this.tag}>`;
    }

    addChild(child: Element | string) {
        this.children.push(child);
        return this;
    }
};