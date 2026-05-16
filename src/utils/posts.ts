import { getCollection, type CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

export const getPosts = async () => {
  return (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
};

export const postsGroupByYear = async () => {
  const postByYear: {
    [year: number]: Post[];
  } = {};

  const posts = await getPosts();

  posts.forEach((post) => {
    const year = post.data.pubDate.getFullYear();
    if (!postByYear[year]) {
      postByYear[year] = [];
    }
    postByYear[year].push(post);
  });

  return Object.keys(postByYear)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map((year) => ({ year, posts: postByYear[parseInt(year)] }));
};
