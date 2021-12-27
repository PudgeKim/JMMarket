import React from "react";
import styles from "./nftCard.module.css";

export default function NftCard({ imgPath, nftId, name }) {
  return (
    <div className={styles.nftCard}>
      <img className={styles.nftImg} src={imgPath} alt="nftImg" />
      <div className={styles.nftInfo}>
        <p className={styles.nftText}>No.{nftId}</p>
        <p className={styles.nftText}>{name}</p>
      </div>
    </div>
  );
}
