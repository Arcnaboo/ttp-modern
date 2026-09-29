import sanitizeHtml from "sanitize-html";
import { safeUrl } from "@/lib/paths";

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "blockquote", "h2", "h3", "h4", "a", "img"],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = safeUrl(attribs.href);
        if (!href) delete attribs.href;
        else attribs.href = href;
        if (attribs.target === "_blank") attribs.rel = "noopener noreferrer";
        return { tagName, attribs };
      },
      img: (tagName, attribs) => {
        const src = (attribs.src ?? "").trim();
        if (!/^(https?:\/\/|\/)/i.test(src)) delete attribs.src;
        return { tagName, attribs };
      },
    },
    exclusiveFilter(frame) {
      return frame.tag === "img" && !frame.attribs.src;
    },
  });
}
