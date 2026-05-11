import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.md",
    generateId: ({ entry, data }) => {
      const entryNoExt = entry.replace(/\.md$/, "");
      const idParts = entryNoExt.split("/");
      const idPart = idParts[idParts.length - 1];
      const rawPubDate = data.pubDate;

      if (rawPubDate) {
        const pubDate = rawPubDate as Date;

        return [
          pubDate.getFullYear(),
          (pubDate.getMonth() + 1).toString().padStart(2, "0"),
          pubDate.getDate().toString().padStart(2, "0"),
          idPart,
        ].join("/");
      }

      return idPart;
    },
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
