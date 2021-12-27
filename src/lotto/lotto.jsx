import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useContext } from "react/cjs/react.development";
import {
  MarioNftContext,
  MetaProviderContext,
  MetaSignerContext,
} from "../App";
import styles from "./lotto.module.css";
import Modal from "./modal";
import TxHashCard from "./txHashCard";

export default function Lotto() {
  const marioNft = useContext(MarioNftContext);
  const { metaProvider, setMetaProvider } = useContext(MetaProviderContext);
  const { metaSigner, setMetaSigner } = useContext(MetaSignerContext);
  const [txHash, setTxHash] = useState("");
  const [modalClose, setModalClose] = useState(true);
  const [nftInfo, setNftInfo] = useState({});

  const txHashHandler = (txHash) => {
    if (txHash === undefined || txHash === null || txHash === "") {
      setTxHash("");
    } else {
      setTxHash(txHash);
    }
  };

  const lottoHandler = async () => {
    if (metaProvider === null) {
      alert("Account 페이지에서 MetaMask와 연결이 필요합니다.");
    } else {
      if (!marioNft.checkIsSigned()) {
        marioNft.setContractWithSigner(metaSigner);
      }

      try {
        const options = {
          value: ethers.utils.parseEther("0.1"),
          gasLimit: 200000,
        };

        const txResponse = await marioNft.lotto(options);

        // signer가 세팅되어있지 않음
        if (txResponse === null) {
          alert("Signer is required");
        } else {
          console.log("res: ", txResponse);
          // txResponse.hash값 가르쳐주기
          txHashHandler(txResponse.hash);
        }
      } catch (e) {
        console.log("lotto error: ", e);
      }
    }
  };

  // 당첨이 되면 이벤트가 들어오고 모달 열림
  marioNft.getContract().on("LottoEvent", async (from, to, nftId, abcToken) => {
    // 왜 아래 콘솔이 2번 찍힐까?
    console.log(
      `LottoEvent from: ${from} to: ${to} nftId: ${nftId} abcToken: ${abcToken}`
    );
    const metadata = (await marioNft.getMetadataFromIpfs(nftId)).data;
    setNftInfo({
      nftId: nftId.toNumber(),
      imgPath: metadata.image,
      name: metadata.name,
    });
    setModalClose(false);
  });

  return (
    <div className={styles.lottoContainer}>
      <div
        className={styles.questionCard}
        onClick={() => {
          lottoHandler();
        }}
      >
        <img
          className={styles.questionImg}
          src="/images/question_mark.png"
          alt="qMark"
        />
      </div>
      <div className={styles.textContainer}>
        <span className={styles.lottoText}>
          Click question mark to get random NFT!
        </span>
      </div>
      {txHash === "" ? null : <TxHashCard txHash={txHash} />}

      <Modal
        lottoType="nft"
        modalClose={modalClose}
        setModalClose={setModalClose}
        nftInfo={nftInfo}
      />

      <button
        onClick={async () => {
          console.log("marioNft: ", marioNft);
          console.log("uri: ", marioNft.baseUri);
          console.log(
            "success get: ",
            (await marioNft.getMetadataFromIpfs(1)).data
          );
          console.log("curAmount: ", await marioNft.getAllNftCurrentAmount());
        }}
      >
        cc
      </button>
    </div>
  );
}
