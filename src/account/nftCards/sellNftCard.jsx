import React from "react";
import BaseNftCard from "./baseNftCard";
import styles from "./sellNftCard.module.css";

export default function SellNftCard({
  imgPath,
  nftId,
  orderId,
  price,
  timestamp,
}) {
  const bodyTag = (
    <div className={styles.nftInfo}>
      <p className={styles.headText}>No.{nftId}</p>
      <p className={styles.bodyText}>주문번호: {orderId}</p>
      <p className={styles.bodyText}>가격: {price}ABC</p>
      <p className={styles.bodyText}>타임스탬프: {timestamp}</p>
    </div>
  );
  return <BaseNftCard imgPath={imgPath} bodyTag={bodyTag} />;
}
