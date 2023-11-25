import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../api/graphql/libs/context';

export const GET = async (req: NextRequest) => {
  return new NextResponse(await generateSitemapXml(req), {
    headers: { 'Content-Type': 'application/xml' },
  });
};

const generateSitemapXml = async (req: NextRequest) => {
  const host = req.headers.get('host') ?? '';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const posts = await prisma.post.findMany({ where: { published: true } });
  posts?.forEach((v) => {
    xml += `
      <url>
        <loc>https://${host}/contents/${v.id}</loc>
        <lastmod>${v.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
      </url>
    `;
  });
  const lastTime = posts?.length && Math.max(...posts.map((v) => v.updatedAt.getTime() || 0));
  if (lastTime) {
    xml += `
      <url>
        <loc>https://${host}/</loc>
        <lastmod>${new Date(lastTime).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
      </url>
    `;
  }
  xml += `</urlset>`;
  return xml;
};

export const runtime = 'edge';
