import contentful from 'contentful';
import 'dotenv/config';

export default function getClient() {
  let client;
  if (process.env.CONTENTFUL_CONTENT_STATUS === 'preview') {
    process.env.CONTENTFUL_HOST = 'preview.contentful.com';
    client = contentful.createClient({
      space: process.env.CONTENTFUL_SPACE,
      environment: process.env.CONTENTFUL_ENVIRONMENT, // defaults to 'master' if not set
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      host: process.env.CONTENTFUL_HOST,
    });
  }else{
    process.env.CONTENTFUL_HOST = 'cdn.contentful.com';
    client = contentful.createClient({
      space: process.env.CONTENTFUL_SPACE,
      environment: process.env.CONTENTFUL_ENVIRONMENT, // defaults to 'master' if not set
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });
  }
  return client;
}