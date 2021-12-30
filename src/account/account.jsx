import React, { useContext, useEffect, useState } from "react";
import styles from "./account.module.css";
import { ethers } from "ethers";
import {
  abcToken,
  MarioNftContext,
  MetaProviderContext,
  MetaSignerContext,
} from "../App";
import SellNft from "./sellNft";
import PossessNftCard from "./nftCards/possessNftCard";
import { marioNft } from "../App";

export default function Account() {
  const [errorMessage, setErrorMessage] = useState(null);
  const { metaProvider, setMetaProvider } = useContext(MetaProviderContext);
  const { metaSigner, setMetaSigner } = useContext(MetaSignerContext);
  const [currentAccount, setCurrentAccount] = useState(null);
  // 연결된 account가 가지고 있는 nft들 (판매중이지 않은)
  const [possessNftList, setNftList] = useState([]);
  // 연결된 account가 판매중인 nft들
  const [sellNftList, setSellNftList] = useState([]);

  useEffect(() => {
    const getPossessNftList = async () => {
      const nftListWithAmount = await marioNft.getNftListByAccount(
        currentAccount
      );
      setNftList(nftListWithAmount);
    };

    const getSellingNftList = async () => {
      const sellingNftList = await marioNft.getSellingNftList();
      const convertedList = [];
      for (let i = 0; i < sellingNftList.length; i++) {
        const nftInfo = sellingNftList[i];
        const nftId = nftInfo.nftId.toNumber();
        const orderId = nftInfo.orderId.toNumber();
        const price = ethers.utils.formatEther(nftInfo.price);
        const timestamp = nftInfo.date.toNumber();
        const imgPath = await marioNft.getNftImageById(nftId);
        convertedList.push({
          imgPath,
          nftId,
          orderId,
          price,
          timestamp,
        });
      }
      console.log("res: ", convertedList); ///////
      setSellNftList(convertedList);
    };

    if (metaSigner != null) {
      getPossessNftList();
      getSellingNftList();
    }
  }, [metaSigner]); // metaSigner가 없으면 msg.sender는 0x0000000으로 나오기 때문에 metaSigner를 감지

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length === 0) {
          setErrorMessage(
            "No Account. Please check your MetaMask. It needs Mumbai network."
          );
        } else {
          accountChangeHandler(accounts[0]);
        }
      } catch (e) {
        setErrorMessage(e);
      }
    } else {
      setErrorMessage("Need to install MetaMask and add Mumbai network.");
    }
  };

  const accountChangeHandler = (newAccount) => {
    setCurrentAccount(newAccount);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setMetaProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setMetaSigner(tempSigner);

    if (!marioNft.checkIsSigned()) {
      marioNft.setContractWithSigner(tempSigner); // metaSigner는 setState의 비동기로 인해 제대로 안될 수도
    }

    if (!abcToken.checkIsSigned()) {
      abcToken.setContractWithSigner(tempSigner);
    }
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      connectWalletHandler();
    });
  }

  return (
    <div>
      <div
        className={styles.connectBtn}
        onClick={() => {
          connectWalletHandler();
        }}
      >
        <span className={styles.connectText}>Connect To MetaMask</span>
      </div>
      {metaProvider !== null ? "Connected" : "Not Connected"}
      {errorMessage}

      {possessNftList.length === 0 ? null : (
        <h2 className={styles.ownNftText}>보유하고 있는 NFT</h2>
      )}
      <div className={styles.nftCards}>
        {possessNftList.length === 0
          ? null
          : possessNftList.map((nftInfo, idx) => (
              <PossessNftCard
                key={idx}
                imgPath={nftInfo.metadata.image}
                nftId={nftInfo.nftId}
                name={nftInfo.metadata.name}
                amount={nftInfo.amount}
              />
            ))}
      </div>

      <SellNft
        possessNftList={possessNftList}
        sellNftList={sellNftList}
        currentAccount={currentAccount}
      />
    </div>
  );
}
