import sanityClient from '@sanity/client';

export const client = sanityClient({
    projectId: 'p0fyy942',
    dataset: 'production',
    apiVersion: '2023-07-27',
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
