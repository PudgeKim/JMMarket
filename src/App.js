import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./header/header";
import Lotto from "./lotto/lotto";
import MainBody from "./main-body/mainBody";
import { createContext, useState } from "react";
import { MarioNft } from "./helper/marioNft";
import Account from "./account/account";
import {
  rpcAlchemy,
  contractAddress,
  abcContractAddress,
} from "./helper/contractMetadata";
import MarioNftAbi from "./helper/marioNftAbi.json";
import Explore from "./explore/explore";
import SellDetail from "./explore/sell-detail/sellDetail";
import NftDetail from "./main-body/nft-detail/nftDetail";
import { AbcToken } from "./helper/abcToken";

export const MetaProviderContext = createContext({});
export const MetaSignerContext = createContext({});

// 해당 인스턴스를 App 컴포넌트 안에서 초기화하면 re-render때문에 초기화될 수 있음
export const marioNft = new MarioNft(
  rpcAlchemy,
  contractAddress,
  MarioNftAbi.abi
);

export const abcToken = new AbcToken(abcContractAddress, rpcAlchemy);

function App() {
  const [metaProvider, setMetaProvider] = useState(null);
  const [metaSigner, setMetaSigner] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <MetaSignerContext.Provider value={{ metaSigner, setMetaSigner }}>
                <MetaProviderContext.Provider
                  value={{ metaProvider, setMetaProvider }}
                >
                  <MainBody />
                </MetaProviderContext.Provider>
              </MetaSignerContext.Provider>
            }
          />

          <Route
            path="nft-detail"
            element={
              <MetaSignerContext.Provider value={{ metaSigner, setMetaSigner }}>
                <MetaProviderContext.Provider
                  value={{ metaProvider, setMetaProvider }}
                >
                  <NftDetail />
                </MetaProviderContext.Provider>
              </MetaSignerContext.Provider>
            }
          />

          <Route
            path="explore"
            element={
              <MetaSignerContext.Provider value={{ metaSigner, setMetaSigner }}>
                <MetaProviderContext.Provider
                  value={{ metaProvider, setMetaProvider }}
                >
                  <Explore />
                </MetaProviderContext.Provider>
              </MetaSignerContext.Provider>
            }
          />

          <Route
            path="sell-detail"
            element={
              <MetaSignerContext.Provider value={{ metaSigner, setMetaSigner }}>
                <MetaProviderContext.Provider
                  value={{ metaProvider, setMetaProvider }}
                >
                  <SellDetail />
                </MetaProviderContext.Provider>
              </MetaSignerContext.Provider>
            }
          />

          <Route
            path="lotto"
            element={
              <MetaSignerContext.Provider value={{ metaSigner, setMetaSigner }}>
                <MetaProviderContext.Provider
                  value={{ metaProvider, setMetaProvider }}
                >
                  <Lotto />
                </MetaProviderContext.Provider>
              </MetaSignerContext.Provider>
            }
          />

          <Route
            path="account"
            element={
              <MetaSignerContext.Provider value={{ metaSigner, setMetaSigner }}>
                <MetaProviderContext.Provider
                  value={{ metaProvider, setMetaProvider }}
                >
                  <Account />
                </MetaProviderContext.Provider>
              </MetaSignerContext.Provider>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
