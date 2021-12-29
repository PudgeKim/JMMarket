import React from "react";
import Card from "../card/card";
import styles from "./sellNftCard.module.css";

export default function SellNftCard({
  imgPath,
  nftId,
  name,
  orderId,
  price,
  onClick,
}) {
  const bodyTag = (
    <div className={styles.nftInfo}>
      <p>No.{nftId}</p>
      <p>{name}</p>
      <p>주문번호: {orderId}</p>
      <p>판매 가격: {price} ABC</p>
    </div>
  );

  return <Card imgPath={imgPath} bodyTag={bodyTag} onClick={onClick} />;
}
