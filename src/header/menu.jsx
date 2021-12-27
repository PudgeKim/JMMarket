import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./menu.module.css";

export default function Menu() {
  const navigate = useNavigate();
  return (
    <div className={styles.menu}>
      <ul className={styles.menuList}>
        <li>Explore</li>
        <li
          onClick={() => {
            navigate("/lotto");
          }}
        >
          Lotto
        </li>
        <li
          onClick={() => {
            navigate("/account");
          }}
        >
          Account
        </li>
      </ul>
    </div>
  );
}
