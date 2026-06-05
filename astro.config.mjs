import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineHastPlugin } from "satteri";
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

export default defineConfig({
  site: siteConfig.site,
  base: "/",
  output: "static",
  compressHTML: true,
  integrations: [
    icon(),
    sitemap({
      xslURL: "/rss/sitemap.xsl",
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  markdown: {
    processor: satteri({
      hastPlugins: [mdExternalLinks],
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
