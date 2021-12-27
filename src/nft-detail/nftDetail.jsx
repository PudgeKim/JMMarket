import React, { useContext, useEffect, useState } from "react";
import styles from "./nftDetail.module.css";
import { useLocation } from "react-router-dom";
import { MetaProviderContext, MarioNftContext } from "../App";
import { setValueIfNotNull } from "../helper/helpers";
import AttributeCard from "./attributeCard";
import BuyButton from "./buyButton";

export default function NftDetail() {
  const [metadata, setMetadata] = useState({});
  const { state } = useLocation();
  const marioNft = useContext(MarioNftContext);
  const { metaProvider, setMetaProvider } = useContext(MetaProviderContext);

  // metadata를 ipfs로부터 가져오기 전까지는 metadata.attributes가 에러가 나기 때문
  const checkAttributes = (metadata) => {
    if (Object.keys(metadata).length === 0) {
      return false;
    }
    if (metadata.attributes.length > 0) {
      return true;
    }
    return false;
  };

  const renderAttributes = (attributes) => {
    return attributes.map((attribute, idx) => {
      return <AttributeCard key={idx} attribute={attribute} />;
    });
  };

  useEffect(() => {
    const getDetailInfo = async (nftId) => {
      const nftDetail = await marioNft.getNftDetail(nftId);
      console.log("detail: ", nftDetail); //////
      setMetadata(nftDetail);
    };
    getDetailInfo(state.nftId);
    console.log("loginProvider: ", metaProvider); /////
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.imgContainer}>
          <img
            className={styles.nftImg}
            src={setValueIfNotNull(metadata, metadata.imgPath)}
            alt="nftImg"
          />
        </div>

        <div className={styles.blockInfo}>blockInfo</div>
        <BuyButton nftId={state.nftId} />
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.nftInfoContainer}>
          <h1>{setValueIfNotNull(metadata, metadata.name)}</h1>
          <p>ID: {state.nftId}</p>
          <h3>Description</h3>
          <p>{setValueIfNotNull(metadata, metadata.description)}</p>
          <h3>Attribute</h3>
          {checkAttributes(metadata)
            ? renderAttributes(metadata.attributes)
            : null}
        </div>
      </div>
    </div>
  );
}
