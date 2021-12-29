import React from "react";
import Card from "../card/card";
import styles from "./nftBriefCard.module.css";

export default function NftBriefCard({
  imgPath,
  nftId,
  name,
  totalAmount,
  currentAmount,
  onClick,
}) {
  const bodyTag = (
    <div className={styles.nftInfo}>
      <p>No.{nftId}</p>
      <p>{name}</p>
      <p>총 발행량: {totalAmount}</p>
      <p>남아있는 수량: {currentAmount}</p>
    </div>
  );
  return <Card imgPath={imgPath} bodyTag={bodyTag} onClick={onClick} />;
}
