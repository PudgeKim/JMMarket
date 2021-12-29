import React, { useEffect } from "react";
import { useContext, useState } from "react/cjs/react.development";
import { MarioNftContext } from "../App";
import { setValueIfNotNull } from "../helper/helpers";
import AttributeCard from "./attributeCard";
import styles from "./baseDetail.module.css";
import { marioNft } from "../App";

// leftBodyTag = 왼쪽 이미지 아래 정보 공간
// rightBodyTag = 오른쪽 추가 정보 공간
export default function BaseDetail({ nftId, leftBodyTag, rightBodyTag }) {
  const [metadata, setMetadata] = useState({});

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
      setMetadata(nftDetail);
    };

    getDetailInfo(nftId);
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
        {leftBodyTag}
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.nftInfoContainer}>
          <h1>
            No.{nftId} {setValueIfNotNull(metadata, metadata.name)}
          </h1>
          {rightBodyTag}
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
