import { React, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MarioNftContext } from "../App";
import styles from "./mainBody.module.css";
import NftBriefCard from "./nftBriefCard";

export default function MainBody() {
  const [cards, setCards] = useState([]);
  const marioNft = useContext(MarioNftContext);
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
