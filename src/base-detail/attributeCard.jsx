import React from "react";
import styles from "./attributeCard.module.css";

export default function AttributeCard({ attribute }) {
  const objKeys = Object.keys(attribute);
  return (
    <li className={styles.card}>
      <ul>
        {objKeys.map((objKey, idx) => {
          return (
            <li key={idx} className={styles.property}>
              <span
                className={styles.text}
              >{`${objKey}: ${attribute[objKey]}`}</span>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
