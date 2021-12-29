import React from "react";
import styles from "./card.module.css";

export default function Card({ imgPath, bodyTag, onClick }) {
  return (
    <li className={styles.card} onClick={onClick}>
      <img className={styles.nftImg} src={imgPath} alt="nftImg" />
      {bodyTag}
    </li>
  );
}
