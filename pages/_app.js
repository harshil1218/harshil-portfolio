import React from "react";
import Layout from "@/shared/Layout";
import "@/styles/global.css";
import "@/styles/style.scss";
import "@/styles/responsive.scss";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
