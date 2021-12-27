import React from "react";
import styles from "./card.module.css";

export default function Card({
  imgPath,
  nftId,
  name,
  totalAmount,
  currentAmount,
  onClick,
}) {
  return (
    <li className={styles.card} onClick={onClick}>
      <img className={styles.nftImg} src={imgPath} alt="nftImg" />
      <div className={styles.nftInfo}>
        <p>No.{nftId}</p>
        <p>{name}</p>
        <p>총 발행량: {totalAmount}</p>
        <p>남아있는 수량: {currentAmount}</p>
      </div>
    </li>
  );
}
