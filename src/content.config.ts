import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.md",
    generateId: ({ entry, data }) => {
      const entryNoExt = entry.replace(/\.md$/, '')
      const idParts = entryNoExt.split('/')
      const idPart = idParts[idParts.length - 1]
      const { pubDate } = data

      if (pubDate) {
        return [
          data.pubDate.getFullYear(),
          (data.pubDate.getMonth() + 1).toString().padStart(2, '0'),
          data.pubDate.getDate().toString().padStart(2, '0'),
          idPart
        ].join('/')
      }

      return idPart
    }
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
