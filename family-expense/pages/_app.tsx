import { SessionProvider } from "next-auth/react";
import 'antd/dist/antd.css';
import { AppProps } from 'next/app';


function MyApp({ Component, pageProps }:AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps}></Component>
    </SessionProvider>
  );
}

export default MyApp;