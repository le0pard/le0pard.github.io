import { defineConfig } from "astro/config";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineHastPlugin, defineMdastPlugin } from "satteri";
import { satteri } from "@astrojs/markdown-satteri";
import { siteConfig } from "./src/settings";

const mdExternalLinks = defineHastPlugin({
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties.href;
      if (typeof href === "string" && href.startsWith("http")) {
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener noreferrer");
      }
    },
  },
});

const satteriMermaidUnwrapper = defineMdastPlugin({
  name: "raw-html-mermaid-braces",
  code(node) {
    if (node.type === "code" && node.lang === "mermaid") {
      // Escape HTML characters to prevent the compiler parser from choking
      const escapedValue = node.value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return {
        rawHtml: `<pre class="mermaid">${escapedValue}</pre>`,
      };
    }
  }
});

export default defineConfig({
  site: siteConfig.site,
  base: "/",
  output: "static",
  compressHTML: true,
  integrations: [
    sitemap({
      xslURL: "/rss/sitemap.xsl",
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  markdown: {
    processor: satteri({
      hastPlugins: [
        mdExternalLinks
      ],
      mdastPlugins: [
        satteriMermaidUnwrapper
      ],
      features: {
        gfm: true,
        frontmatter: true,
      },
    }),
  },
  build: {
    assets: "assets",
    format: "file",
    inlineStylesheets: "never",
  },
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(
          browserslist(
            ">0.3%",
            "Firefox ESR",
            "not dead",
            "not ie 11",
            "not op_mini all",
          ),
        ),
      },
    },
    plugins: [yaml()],
    build: {
      cssCodeSplit: false,
      minify: "esbuild",
    },
  },
});
