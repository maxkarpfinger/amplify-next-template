"use client";

import Head from "next/head";

export default function SubPage() {
  return (
    <>
      <Head>
        <title>Subpage Title</title>
        <meta name="description" content="This is a subpage." />
      </Head>
      <main className="container">
        <h1 className="title">Welcome to the Subpage</h1>
        <p>This is the content of the subpage.</p>
      </main>
    </>
  );
}