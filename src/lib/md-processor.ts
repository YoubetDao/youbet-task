import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItKatex from '@vscode/markdown-it-katex'

export class MarkdownProcessor {
  private contentHtml: string
  private toc: { id: string; title: string; slug: string }[] = []

  constructor(content: string) {
    const md = markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
    md.use(markdownItAnchor, {
      level: [1, 2, 3],
      slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase()),
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        symbol: '|',
        placement: 'before',
      }),
      callback: (token, { slug, title }: { slug: string; title: string }) => {
        const id = `toc-${token.tag}`
        this.toc.push({ id, title, slug })
      },
    })
    md.use(markdownItKatex)
    // TODO: add code pre color

    this.contentHtml = md.render(content)
  }

  public getContentHtml(): string {
    return this.contentHtml
  }

  public getToCData(): { id: string; title: string; slug: string }[] {
    return this.toc
  }

  public static getPlainText(mdText: string): string {
    const md = markdownIt({
      html: true,
    })
    const html = md.render(mdText || '')
    const text = html.replace(/<[^>]+>/g, '')
    return text
  }
}
