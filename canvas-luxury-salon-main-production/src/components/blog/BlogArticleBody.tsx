import type { ReactNode } from "react";

type InlinePart = { type: "text" | "bold" | "em"; text: string };

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) {
      parts.push({ type: "text", text: text.slice(last, m.index) });
    }
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push({ type: "bold", text: token.slice(2, -2) });
    } else {
      parts.push({ type: "em", text: token.slice(1, -1) });
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts.length ? parts : [{ type: "text", text }];
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((p, i) => {
        if (p.type === "bold")
          return (
            <strong key={i} className="font-semibold text-ink">
              {p.text}
            </strong>
          );
        if (p.type === "em")
          return (
            <em key={i} className="italic text-ink">
              {p.text}
            </em>
          );
        return <span key={i}>{p.text}</span>;
      })}
    </>
  );
}

/**
 * Lightweight markdown for blog bodies:
 * ## / ### headings, - or * lists, blank-line paragraphs, **bold** *italic*
 */
export function BlogArticleBody({ body }: { body: string }) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3
          key={key++}
          className="mt-10 font-display text-xl italic leading-snug text-ink sm:text-2xl"
        >
          <Inline text={trimmed.slice(4)} />
        </h3>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="mt-12 font-display text-[1.65rem] leading-snug text-ink sm:text-3xl"
        >
          <Inline text={trimmed.slice(3)} />
        </h2>
      );
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul
          key={key++}
          className="mt-4 list-disc space-y-2 pl-5 text-[1.02rem] leading-relaxed text-ink-soft marker:text-accent"
        >
          {items.map((item, idx) => (
            <li key={idx}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const para: string[] = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !/^[-*]\s+/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push(
      <p
        key={key++}
        className="mt-4 text-[1.05rem] leading-[1.75] text-ink-soft"
      >
        <Inline text={para.join(" ")} />
      </p>
    );
  }

  return <div className="blog-article-body">{blocks}</div>;
}
