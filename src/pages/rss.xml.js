import { siteConfig } from "~/settings";
import rss from "@astrojs/rss";
import { getPosts } from "@utils/posts";

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    // Use custom XSL stylesheet for browsers
    stylesheet: "/rss/style.xsl",
    // General site info
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    xmlns: {
      creativeCommons: "http://backend.userland.com/creativeCommonsRssModule",
      atom: "http://www.w3.org/2005/Atom",
      content: "http://purl.org/rss/1.0/modules/content/",
    },
    customData: [
      "<language>uk-UA</language>",
      // atom
      `<atom:link href="${new URL("rss.xml", import.meta.env.SITE)}" rel="self" type="application/rss+xml" />`,
      `<atom:link href="${import.meta.env.SITE}" rel="hub" xmlns="http://www.w3.org/2005/Atom" />`,
      // creative common
      "<creativeCommons:license>https://creativecommons.org/licenses/by/4.0/</creativeCommons:license>",
    ].join(""),
    // Blog entries
    items: posts.map((post) => ({
      ...post.data,
      link: `/${post.id}`,
    })),
  });
}
