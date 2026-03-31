import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const writing = await getCollection('writing', ({ data }) => !data.draft);
  return rss({
    title: 'Othniel Agera | Backend Engineering Journal',
    description:
      'Thoughts on distributed systems, database optimization, and scalable architectures.',
    site: context.site!,
    items: writing.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.summary,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
