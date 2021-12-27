import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import Menu from "./menu";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className={styles.header}>
      <div
        className={styles.logoBox}
        onClick={() => {
          navigate("/");
        }}
      >
        <img className={styles.logoImg} src="/images/logo.png" alt="logo" />
      </div>

      <div className={styles.searchBar}></div>

      <Menu />
    </div>
  );
}
