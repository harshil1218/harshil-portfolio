import Head from "next/head";
import React from "react";

const MetaData = ({
  title = "harshil.dev",
  description = "Harshil — full-stack developer in Ahmedabad. React, Next.js, Node and MongoDB. Also leads projects at Zyden IT Solutions.",
  url = "https://harshil-portfolio-mu.vercel.app",
  image = "/og-image.jpg",
}) => {
  /* link previews (WhatsApp, LinkedIn, X) only accept an absolute image URL */
  const imageUrl = image.startsWith("http") ? image : `${url}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Harshil — Full-stack developer from UI to API" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

export default MetaData;
