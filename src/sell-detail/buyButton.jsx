import React from "react";
import styles from "./buyButton.module.css";

export default function BuyButton({ orderId }) {
  return (
    <div className={styles.btn}>
      <span className={styles.text}>BUY</span>
    </div>
  );
}
