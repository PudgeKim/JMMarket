import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./mainBody.module.css";
import NftBriefCard from "./nftBriefCard";
import { marioNft } from "../App";

export default function MainBody() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const setBriefInfo = async () => {
      setCards(await marioNft.getAllNftBriefInfo());
    };
    setBriefInfo();
  }, []);

  const goToDetail = (nftId) => {
    navigate("nft-detail", { state: { nftId: nftId } });
  };

  return (
    <ul className={styles.cardList}>
      {cards.map((card, idx) => (
        <NftBriefCard
          key={idx}
          imgPath={card.imgPath}
          nftId={idx + 1}
          name={card.name}
          totalAmount={card.totalAmount}
          currentAmount={card.currentAmount}
          onClick={() => {
            goToDetail(idx + 1);
          }}
        />
      ))}
    </ul>
  );
}
