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
    // Blog entries
    items: posts.map((post) => ({
      ...post.data,
      link: `/${post.id}`,
    })),
  });
}
