import React from "react";
import BaseNftCard from "./baseNftCard";
import styles from "./possessNftCard.module.css";

export default function PossessNftCard({ imgPath, nftId, name, amount }) {
  const bodyTag = (
    <div className={styles.nftInfo}>
      <p className={styles.nftText}>No.{nftId}</p>
      <p className={styles.nftText}>{name}</p>
      <p className={styles.nftAmount}>가지고 있는 수량: {amount}</p>
    </div>
  );
  return <BaseNftCard imgPath={imgPath} bodyTag={bodyTag} />;
}
