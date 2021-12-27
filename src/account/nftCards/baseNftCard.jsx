import React from "react";
import styles from "./baseNftCard.module.css";

export default function BaseNftCard({ imgPath, bodyTag }) {
  return (
    <div className={styles.nftCard}>
      <img className={styles.nftImg} src={imgPath} alt="nftImg" />
      {bodyTag}
    </div>
  );
}
