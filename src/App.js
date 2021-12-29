import { BrowserRouter, Routes, Route } from "react-router-dom";
import NftDetail from "./nft-detail/nftDetail";
import Header from "./header/header";
import Lotto from "./lotto/lotto";
import MainBody from "./main-body/mainBody";
import { createContext, useEffect, useState } from "react";
import { MarioNft } from "./helper/marioNft";
import Account from "./account/account";
import { rpc, rpcAlchemy, contractAddress } from "./helper/contractMetadata";
import MarioNftAbi from "./helper/marioNftAbi.json";
import Explore from "./explore/explore";
import SellDetail from "./sell-detail/sellDetail";

export const MarioNftContext = createContext("Default Value");
export const MetaProviderContext = createContext({});
export const MetaSignerContext = createContext({});

// 해당 인스턴스를 App 컴포넌트 안에서 초기화하면 re-render때문에 초기화될 수 있음
const marioNft = new MarioNft(rpcAlchemy, contractAddress, MarioNftAbi.abi);

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
                  <MarioNftContext.Provider value={marioNft}>
                    <MainBody />
                  </MarioNftContext.Provider>
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
                  <MarioNftContext.Provider value={marioNft}>
                    <NftDetail />
                  </MarioNftContext.Provider>
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
                  <MarioNftContext.Provider value={marioNft}>
                    <Explore />
                  </MarioNftContext.Provider>
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
                  <MarioNftContext.Provider value={marioNft}>
                    <SellDetail />
                  </MarioNftContext.Provider>
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
                  <MarioNftContext.Provider value={marioNft}>
                    <Lotto />
                  </MarioNftContext.Provider>
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
                  <MarioNftContext.Provider value={marioNft}>
                    <Account />
                  </MarioNftContext.Provider>
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
