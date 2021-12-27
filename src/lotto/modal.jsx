import React from "react";
import styles from "./modal.module.css";
import NftCard from "./nftCard";

// lottoType = nft, abcToken, bond
export default function Modal({
  lottoType,
  modalClose,
  setModalClose,
  nftInfo,
}) {
  const closeModal = () => {
    setModalClose(true);
  };
  return (
    <div
      className={`${styles.modal} ${
        modalClose ? styles.modalOff : styles.modalOn
      }`}
      onClick={() => {
        closeModal();
      }}
    >
      <div className={styles.modalBody}>
        <span className={styles.modalText}>당첨된 상품!</span>
        <NftCard
          imgPath={nftInfo.imgPath}
          name={nftInfo.name}
          nftId={nftInfo.nftId}
        />
      </div>
    </div>
  );
}
