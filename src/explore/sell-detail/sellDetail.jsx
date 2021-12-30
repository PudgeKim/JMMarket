import React from "react";
import { useLocation } from "react-router-dom";
import { useContext } from "react/cjs/react.development";
import { MetaSignerContext } from "../../App";
import AttributeCard from "../../base-detail/attributeCard";
import BaseDetail from "../../base-detail/baseDetail";
import BuyButton from "./buyButton";
import styles from "./sellDetail.module.css";

export default function SellDetail() {
  const { state } = useLocation();
  const { seller, timestamp, orderId, price } = state;
  const { metaSigner, setMetaSigner } = useContext(MetaSignerContext);
  const blockInfoObj = { timestamp: timestamp };

  const blockInfoBox = (
    <div className={styles.blockInfo}>
      <AttributeCard attribute={blockInfoObj} />
      <BuyButton orderId={orderId} price={price} metaSigner={metaSigner} />
    </div>
  );

  const sellerInfoBox = (
    <div className={styles.sellerInfo}>
      <h3>Seller</h3>
      <span>{seller}</span>
      <h3>Price</h3>
      <span>{price} ABC</span>
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
