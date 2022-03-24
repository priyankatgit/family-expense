import styles from "../styles/login.module.css";
import { getProviders, signIn } from "next-auth/react";
import React from "react";

export default function login({ providers }) {
  return (
    <div
      className={styles.GSignInBtn}
      onClick={() => signIn(providers["google"].id)}
    >
      <div className={styles.ContentWrapper}>
        <div class={styles.LogoWrapper}>
          <img src="https://developers.google.com/identity/images/g-logo.png" />
        </div>
        <span class={styles.TextContainer}>
          <span>Sign in with Google</span>
        </span>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
