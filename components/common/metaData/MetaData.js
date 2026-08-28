import Head from "next/head";
import React from "react";

const MetaData = ({
  title = "harshil.dev",
  description = "Harshil — full-stack developer in Ahmedabad. React, Next.js, Node and MongoDB.",
  url = "https://harshil.dev",
  image = "/projects/portrait.jpg",
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href={url} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    <meta name="twitter:card" content="summary_large_image" />
  </Head>
);

export default MetaData;
