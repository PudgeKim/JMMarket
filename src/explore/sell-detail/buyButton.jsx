import React from "react";
import styles from "./buyButton.module.css";
import { marioNft } from "../../App";
import {
  BuyOwnNftError,
  NeedSignerError,
  NotEnoughAbcTokenError,
  UnknownError,
} from "../../helper/marioNft";
import { ethers } from "ethers";

export default function BuyButton({ orderId, price }) {
  const buyNftHandler = async () => {
    const priceBigNumber = ethers.utils.parseEther(String(price));
    const { success, message } = await marioNft.buyNft(orderId, priceBigNumber);

    if (success === false) {
      switch (message) {
        case NeedSignerError:
          alert("Account페이지에서 메타마스크와 연결이 필요합니다.");
          break;
        case NotEnoughAbcTokenError:
          alert("ABC토큰이 부족합니다.");
          break;
        case BuyOwnNftError:
          alert("자신의 판매품은 구매할 수 없습니다.");
          break;
        default:
          alert("알 수 없는 에러가 발생하였습니다.", UnknownError);
      }
    } else {
      alert(
        "구매 주문이 등록되었습니다. 트랜잭션 완료까지 시간이 소요될 수 있습니다."
      );
    }
  };

  return (
    <div
      className={styles.btn}
      onClick={() => {
        buyNftHandler(orderId, price);
      }}
    >
      <span className={styles.text}>BUY</span>
    </div>
  );
}
