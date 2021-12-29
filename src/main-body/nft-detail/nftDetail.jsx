import React from "react";
import styles from "./nftDetail.module.css";
import { useLocation } from "react-router-dom";
import BaseDetail from "../../base-detail/baseDetail";

export default function NftDetail() {
  const { state } = useLocation();

  return <BaseDetail nftId={state.nftId} />;
}
