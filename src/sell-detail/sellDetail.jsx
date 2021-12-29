import React from "react";
import { useLocation } from "react-router-dom";
import AttributeCard from "../base-detail/attributeCard";
import BaseDetail from "../base-detail/baseDetail";
import BuyButton from "./buyButton";
import styles from "./sellDetail.module.css";

export default function SellDetail() {
  const { state } = useLocation();
  const { seller, timestamp, orderId } = state;
  const blockInfoObj = { timestamp: timestamp };

  const blockInfoBox = (
    <div className={styles.blockInfo}>
      <AttributeCard attribute={blockInfoObj} />
      <BuyButton orderId={orderId} />
    </div>
  );

  const sellerInfoBox = (
    <div className={styles.sellerInfo}>
      <h3>Seller</h3>
      <span>{seller}</span>
    </div>
  );
  return (
    <BaseDetail
      nftId={state.nftId}
      leftBodyTag={blockInfoBox}
      rightBodyTag={sellerInfoBox}
    />
  );
}
