import { EmbedField, EmbedFooter, EmbedImage, EmbedAuthor } from "oceanic.js";

const colorList = {
    'DEFAULT': '0',
    'AQUA': '1752220',
    'GREEN': '3066993',
    'BLUE': '3447003',
    'PURPLE': '10181046',
    'GOLD': '15844367',
    'ORANGE': '15105570',
    'RED': '15158332',
    'GREY': '9807270',
    'DARKER_GREY': '8359053',
    'NAVY': '3426654',
    'DARK_AQUA': '1146986',
    'DARK_GREEN': '2067276',
    'DARK_BLUE': '2123412',
}

interface EmbedOptions {
    title?: string;
    description?: string;
    color?: number;
    fields?: EmbedField[];
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedImage;
    author?: EmbedAuthor;
    timestamp?: Date;
}

export default class EmbedBuilder implements EmbedOptions {
    title?: string;
    description?: string;
    color?: number;
    fields?: EmbedField[];
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedImage;
    author?: EmbedAuthor;
    timestamp?: Date;

    constructor(data?: EmbedOptions) {
        this.title = data?.title
        this.description = data?.description
        this.color = data?.color || 0
        this.fields = data?.fields
        this.footer = data?.footer
        this.image = data?.image
        this.thumbnail = data?.thumbnail
        this.author = data?.author
        this.timestamp = data?.timestamp
    }

    setTitle(title: string) {
        this.title = title
        return this
    }

    setDescription(description: string) {
        this.description = description
        return this
    }

    setColor(color: string) {
        const convertColor = parseInt(color.replace("#", ""), 16)
        if (colorList[color.toUpperCase() as keyof typeof colorList]) {
            this.color = Number(colorList[color.toUpperCase() as keyof typeof colorList])
        } else if (convertColor) {
            this.color = Number(convertColor.toString())
        }
        return this
    }

    addField(name: string, value: string, inline?: boolean) {
        if (!this.fields) this.fields = []
        if (this.fields.length >= 25) throw new Error("You can't add more than 25 fields")
        this.fields.push({
            name: name,
            value: value,
            inline: inline
        })
        return this
    }

    addFields(...fields: EmbedField[]) {
        if (!this.fields) this.fields = []
        if (this.fields.length + fields.length > 25) throw new Error("You can't add more than 25 fields")
        this.fields.push(...fields)
        return this
    }

    setFooter(text: string, iconURL?: string) {
        this.footer = {
            text: text,
            iconURL: iconURL
        }
        return this
    }

    setImage(url: string) {
        this.image = {
            url: url
        }
        return this
    }

    setThumbnail(url: string) {
        this.thumbnail = {
            url: url
        }
        return this
    }

    setAuthor(name: string, iconURL?: string, url?: string) {
        this.author = {
            name: name,
            iconURL: iconURL,
            url: url
        }
        return this
    }

    build() {
        return {
            title: this.title,
            description: this.description,
            color: this.color,
            fields: this.fields,
            footer: this.footer,
            image: this.image,
            thumbnail: this.thumbnail,
        }
    }
}