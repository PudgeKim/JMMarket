import React, { useEffect } from "react";
import { useContext, useState } from "react/cjs/react.development";
import { MarioNftContext } from "../App";
import styles from "./explore.module.css";
import SellNftCard from "./sellNftCard";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { marioNft } from "../App";

export default function Explore() {
  const [allSellingList, setAllSellingList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllSellingList();
  }, []);

  const getAllSellingList = async () => {
    const allList = await marioNft.getAllSellingNftList();
    const convertedList = [];

    if (allList.length !== 0) {
      for (let i = 0; i < allList.length; i++) {
        const nftInfo = allList[i];
        const nftId = nftInfo.nftId.toNumber();
        const metadata = (await marioNft.getMetadataFromIpfs(nftId)).data;
        const imgPath = metadata.image;
        const name = metadata.name;
        const orderId = nftInfo.orderId.toString();
        const price = ethers.utils.formatEther(nftInfo.price);
        const seller = nftInfo.owner;
        const timestamp = nftInfo.date.toString();

        convertedList.push({
          imgPath,
          nftId,
          name,
          orderId,
          price,
          seller,
          timestamp,
        });
      }

      setAllSellingList(convertedList);
    }
  };

  const goToDetailPage = (
    imgPath,
    nftId,
    name,
    orderId,
    price,
    seller,
    timestamp
  ) => {
    navigate("/sell-detail", {
      state: {
        imgPath,
        nftId,
        name,
        orderId,
        price,
        seller,
        timestamp,
      },
    });
  };

  return (
    <div className={styles.container}>
      {allSellingList.length === 0
        ? null
        : allSellingList.map((nftInfo, idx) => {
            return (
              <SellNftCard
                key={idx}
                imgPath={nftInfo.imgPath}
                nftId={nftInfo.nftId}
                name={nftInfo.name}
                orderId={nftInfo.orderId}
                price={nftInfo.price}
                onClick={() => {
                  goToDetailPage(
                    nftInfo.imgPath,
                    nftInfo.nftId,
                    nftInfo.name,
                    nftInfo.orderId,
                    nftInfo.price,
                    nftInfo.seller,
                    nftInfo.timestamp
                  );
                }}
              />
            );
          })}
    </div>
  );
}
