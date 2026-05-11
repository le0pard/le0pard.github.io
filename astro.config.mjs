import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import rehypeExternalLinks from "rehype-external-links";
import { siteConfig } from "./src/settings";

export default defineConfig({
  site: siteConfig.site,
  base: '/',
  output: "static",
  compressHTML: true,
  integrations: [
    icon(),
    sitemap({
      xslURL: "/rss/sitemap.xsl",
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.7,
      lastmod: new Date()
    }),
  ],
  markdown: {
    gfm: true,
    extendDefaultPlugins: true,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      ],
    ],
  },
  build: {
    assets: 'assets',
    format: 'file',
    inlineStylesheets: 'never'
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
