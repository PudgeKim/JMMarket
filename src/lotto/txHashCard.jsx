import React from "react";
import styles from "./txHashCard.module.css";

export default function TxHashCard({ txHash }) {
  return (
    <div className={styles.txHashCard}>
      <h2 className={styles.txHashTitle}>Transaction Hash</h2>
      <span className={styles.txHash}>{txHash}</span>
    </div>
  );
}
