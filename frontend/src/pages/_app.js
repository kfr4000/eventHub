// frontend/src/pages/_app.js

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/globals.css';
import React, { useEffect } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Bootstrap의 자바스크립트 관련 코드가 필요하다면 여기에 작성
      import('bootstrap/dist/js/bootstrap.bundle.min.js').catch(err => console.error("Bootstrap JS load error:", err));
    }
  }, []);

  return (
    <>
      <Head>
        <title>EventHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;