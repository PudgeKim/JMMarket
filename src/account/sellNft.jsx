import React, { useRef } from "react";
import { useContext, useState } from "react/cjs/react.development";
import { MarioNftContext, MetaSignerContext } from "../App";
import {
  NotEnoughNftBalanceError,
  NotEnoughNftDepositError,
  UnknownError,
  WrongNftIdError,
} from "../helper/marioNft";
import styles from "./sellNft.module.css";
import { ethers } from "ethers";
import SellNftCard from "./nftCards/sellNftCard";

// nftList: 사용자가 소유하고 있는 nft들
export default function SellNft({
  possessNftList,
  sellNftList,
  currentAccount,
}) {
  const marioNft = useContext(MarioNftContext);
  const { metaSigner, setMetaSigner } = useContext(MetaSignerContext);
  const selectedNft = useRef(0);
  const sellPrice = useRef(0);

  // 판매중인 NFT들
  const sellingNftBox = () => {
    return (
      <div className={styles.sellingNftBox}>
        <h2 className={styles.sellingNftText}>판매중인 NFT</h2>
        {sellNftList.map((nftInfo, idx) => {
          return (
            <SellNftCard
              key={idx}
              imgPath={nftInfo.imgPath}
              nftId={nftInfo.nftId}
              orderId={nftInfo.orderId}
              price={nftInfo.price}
              timestamp={nftInfo.timestamp}
            />
          );
        })}
      </div>
    );
  };

  const sellNftHandler = async (nftId, price) => {
    if (!price || isNaN(price)) {
      alert("판매하려는 NFT 가격을 숫자로 입력하세요.");
      return;
    }
    if (nftId === 0) {
      alert("판매하려는 NFT를 선택해주세요.");
      return;
    }
    if (!marioNft.checkIsSigned()) {
      marioNft.setContractWithSigner(metaSigner);
    }

    const priceBigNumber = ethers.utils.parseEther(String(price));

    const res = await marioNft.sellNft(nftId, priceBigNumber);
    if (res.success === false) {
      switch (res.message) {
        case NotEnoughNftDepositError:
          alert("판매 하려는 NFT를 먼저 예치하셔야 합니다.");
          break;
        case WrongNftIdError:
          alert("Nft ID는 1부터 7까지 입니다.");
          break;
        default:
          alert("알 수 없는 에러가 발생하였습니다. 나중에 다시 시도해주세요.");
      }
    } else {
      alert(
        "판매 주문이 성공적으로 등록되었습니다. 트랜잭션 완료까지 시간이 걸릴 수 있습니다."
      );
    }
  };

  const selectedNftHandler = (e) => {
    selectedNft.current = e.target.value;
  };

  const selectBox = () => {
    return (
      <div className={styles.selectBox}>
        <select
          className={styles.nftSelector}
          name="nftSelector"
          id="nftSelector"
          onChange={selectedNftHandler}
        >
          <option value="0">--------------</option>
          {possessNftList.map((nftInfo, idx) => {
            return (
              <option key={idx} value={nftInfo.nftId}>
                {nftInfo.metadata.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const sellPriceHandler = (e) => {
    sellPrice.current = e.target.value;
  };

  const priceInputBox = () => {
    return (
      <div className={styles.priceInputBox}>
        <input type="text" id="sellPrice" onChange={sellPriceHandler} />
      </div>
    );
  };

  marioNft.getContract().on("SellNftEvent", (seller, orderId, nftId, price) => {
    if (
      currentAccount != null &&
      currentAccount.toLowerCase() === seller.toLowerCase()
    ) {
      console.log(
        `SellEvent: seller: ${seller} orderId: ${orderId} nftId: ${nftId} price: ${price}`
      );
    }
  });

  return (
    <div className={styles.container}>
      {sellNftList.length === 0 ? null : sellingNftBox()}

      <h2 className={styles.sellNftText}>NFT 판매</h2>
      {selectBox()}
      {priceInputBox()}
      <button
        onClick={() => {
          sellNftHandler(selectedNft.current, sellPrice.current);
        }}
      >
        sellNft
      </button>
    </div>
  );
}
