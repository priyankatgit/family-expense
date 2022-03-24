import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps}></Component>
    </SessionProvider>
  );
}

export default MyApp;