// frontend/src/pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/globals.css'; // 다른 스타일 파일들도 임포트 가능
import React from 'react';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Bootstrap의 자바스크립트 관련 코드가 필요하다면 여기에 작성
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;
