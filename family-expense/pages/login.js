import { getProviders, signIn } from "next-auth/react";
import React, { useEffect } from "react";
import styles from "../styles/login.module.css";

export default function login({ providers }) {
  useEffect(() => {
    document.title = "Family Expense - Login";
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -30%);",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img alt="FE" src="/logo.png" height={82} preview></img>
      </div>

      <div style={{ marginTop: "30px" }}>
        <div
          className={styles.GSignInBtn}
          onClick={() => signIn(providers["google"].id)}
        >
          <div className={styles.ContentWrapper}>
            <div className={styles.LogoWrapper}>
              <img src="https://developers.google.com/identity/images/g-logo.png" />
            </div>
            <span className={styles.TextContainer}>
              <span>Sign in with Google</span>
            </span>
          </div>
        </div>
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
