import React from "react";
import styles from "./DarkLoading.module.css";

const DarkLoading = () => {
  return (
    <main id={styles.main}>
      <div className={styles.main}>
        <div className={styles.honeycomb}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  );
};

export default DarkLoading;
