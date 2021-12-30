import { ethers } from "ethers";
const axios = require("axios");

export const UnknownError = "unknown error";
export const NeedSignerError = "signer is required";
export const NotEnoughAbcTokenError = "execution reverted: Not enough balance";
export const NotEnoughNftBalanceError =
  "execution reverted: not enough nft balance";
export const NotEnoughNftDepositError =
  "execution reverted: Not enough nft deposit";
export const WrongNftIdError = "execution reverted: nftId must be lower than 8";
export const WrongOrderIdError = "execution reverted: orderId does not exist";
export const BuyOwnNftError = "execution reverted: you can't buy your nft";
export const WithdrawlError =
  "execution reverted: The withdrawl amount couldn't be higher than your total balance";

export class MarioNft {
  constructor(rpc, contractAddr, abi) {
    this.rpc = rpc;
    this.contractAddr = contractAddr;
    this.abi = abi;
    this.isSigned = false;

    this.provider = new ethers.providers.JsonRpcProvider(rpc);
    this.contract = new ethers.Contract(contractAddr, abi, this.provider);
    this.baseUri =
      "https://ipfs.io/ipfs/QmQCTvg4bGJYQupoYq8D31hvwB7RwumsM5wLvpE6j7b2yu/";
    //this.baseUri = null; // constructor에서 async를 사용하지 못하므로 init에서 추가해줌

    // 300000ms = 5 minute
    // ipfs로부터 metadata 가지고 오는게 너무 느려서 5분안에 또 요청하면 cache된 데이터로 처리함
    this.cacheTime = 300000;
    this.cacheNow = new Date();
    // mario nft는 총 7개지만 0번 인덱스는 비워둠 (nftId=1~7)
    this.cacheMetadata = Array(8).fill({});
    this.cacheAllTotalAmount = null;
    this.cacheAllCurAmount = null;
  }

  async init() {
    await this.setBaseUri();
  }

  async getAllNftBriefInfo() {
    const allBriefInfo = [];
    const nftTotalAmounts = await this.getAllNftTotalAmount();
    const nftCurAmounts = await this.getAllNftCurrentAmount();

    for (let i = 1; i < 8; i++) {
      const metadata = (await this.getMetadataFromIpfs(i)).data;
      allBriefInfo.push({
        nftId: i,
        name: metadata.name,
        imgPath: metadata.image,
        totalAmount: nftTotalAmounts[i],
        currentAmount: nftCurAmounts[i],
      });
    }
    return allBriefInfo;
  }

  async getAllNftTotalAmount() {
    if (this.cacheAllTotalAmount === null) {
      const nftTotalAmounts = (await this.contract.getAllNftTotalAmount()).map(
        (bigNum) => bigNum.toNumber()
      );
      this.cacheAllTotalAmount = nftTotalAmounts;
      return nftTotalAmounts;
    }
    return this.cacheAllTotalAmount;
  }

  async getAllNftCurrentAmount() {
    const now = new Date();
    if (
      now - this.cacheNow > this.cacheTime ||
      this.cacheAllCurAmount === null
    ) {
      const nftCurAmounts = (await this.contract.getAllNftCurrentAmount()).map(
        (bigNum) => bigNum.toNumber()
      );
      return nftCurAmounts;
    }
    return this.cacheAllCurAmount;
  }

  async getNftDetail(nftId) {
    const metadata = (await this.getMetadataFromIpfs(nftId)).data;
    const res = {
      name: metadata.name,
      description: metadata.description,
      imgPath: metadata.image,
      attributes: metadata.attributes,
    };
    return res;
  }

  async getNftImageById(nftId) {
    try {
      const metadata = (await this.getMetadataFromIpfs(nftId)).data;
      return metadata.image;
    } catch (e) {
      console.log("getNftImageByIdErr: ", e);
      return "";
    }
  }

  async setBaseUri() {
    let baseUri = "";
    try {
      baseUri = await this.contract.uri(1);
    } catch (e) {
      console.log("setBaseUri error: ", e);
    }
    baseUri = baseUri.replace(/\d+.json/, "");
    this.baseUri = baseUri;
  }

  getBaseUri() {
    return this.baseUri;
  }

  async getMetadataFromIpfs(nftId) {
    const now = new Date();
    let metadata;
    if (
      Object.keys(this.cacheMetadata[nftId]).length === 0 || // cache가 안되있거나
      now - this.cacheNow > this.cacheTime // cacheTime 초과하는 경우
    ) {
      metadata = await axios.get(this.baseUri + String(nftId) + ".json");
      this.cacheMetadata[nftId] = metadata;
    } else {
      metadata = this.cacheMetadata[nftId];
    }

    return metadata;
  }

  // signer가 필요할 때 호출해서 contract을 signer를 적용시킨 후 변경함
  setContractWithSigner(signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(this.contractAddr, this.abi, signer);
    this.isSigned = true;
  }

  async lotto(options) {
    if (this.isSigned) {
      const txResponse = await this.contract.getNftOrTokenByLotto(options);
      return txResponse;
    } else {
      ///////
      console.log("from marioNft class: signer is false");
      return null;
    }
  }

  // async depositNft(nftId) {
  //   if (this.isSigned) {
  //     try {
  //       await this.contract.depositNft(nftId);
  //       return { success: true, message: "" };
  //     } catch (e) {
  //       if (e.data.message === NotEnoughNftBalanceError) {
  //         return { success: false, message: NotEnoughNftBalanceError };
  //       }
  //       console.log("depositNft error: ", e);
  //       return { success: false, message: UnknownError };
  //     }
  //   } else {
  //     return { success: false, message: NeedSignerError };
  //   }
  // }

  async buyNft(orderId, price) {
    if (this.isSigned) {
      try {
        await this.contract.buyNft(orderId, price);
        return { success: true, message: "" };
      } catch (e) {
        if (e.data.message === WrongNftIdError) {
          return { success: false, message: WrongNftIdError };
        }
        if (e.data.message === BuyOwnNftError) {
          return { success: false, message: BuyOwnNftError };
        }
        if (e.data.message === NotEnoughAbcTokenError) {
          return { success: false, message: NotEnoughNftBalanceError };
        }
        console.log("buyNft error: ", e);
        return { success: false, message: UnknownError };
      }
    } else {
      return { success: false, message: NeedSignerError };
    }
  }

  async sellNft(nftId, price) {
    if (this.isSigned) {
      try {
        await this.contract.sellNft(nftId, price);
        return { success: true, message: "" };
      } catch (e) {
        if (e.data.message === NotEnoughNftDepositError) {
          return { success: false, message: NotEnoughNftDepositError };
        }
        if (e.data.message === WrongNftIdError) {
          return { success: false, message: WrongNftIdError };
        }
        console.log("sellNft error: ", e);
        return { success: false, message: UnknownError };
      }
    } else {
      return { success: false, message: NeedSignerError };
    }
  }

  async getNftListByAccount(account) {
    // 해당 account가 소유하고 있는 nft들의 nftId
    const nftIds = [];
    const nftIdsWithAmount = [];
    for (let i = 1; i < 8; i++) {
      const amount = await this.contract.balanceOf(account, i);
      if (amount > 0) {
        nftIds.push({
          nftId: i,
          amount: amount,
        });
      }
    }

    if (nftIds.length === 0) {
      return [];
    }

    for (let i = 0; i < nftIds.length; i++) {
      const metadata = (await this.getMetadataFromIpfs(nftIds[i].nftId)).data;
      nftIdsWithAmount.push({
        nftId: nftIds[i].nftId,
        metadata: metadata,
        amount: nftIds[i].amount.toNumber(),
      });
    }

    return nftIdsWithAmount;
  }

  async getAllSellingNftList() {
    try {
      const allNftList = await this.contract.getAllSellingNftList();
      return allNftList;
    } catch (e) {
      console.log("allNftErr: ", e);
      return [];
    }
  }

  // 현재 접속되있는 계정이 판매하고 있는 NFT들
  async getSellingNftList() {
    try {
      const nftList = await this.contract.getSellingNftList();
      return nftList;
    } catch (e) {
      console.log("nftListERr: ", e);
      return [];
    }
  }

  async getSellerTokenBalance() {
    if (this.isSigned) {
      try {
        const balance = await this.contract.getSellerTokenBalance();
        return { success: true, message: balance.toString() };
      } catch (e) {
        console.log(e);
        return { success: false, message: UnknownError };
      }
    } else {
      return { success: false, message: NeedSignerError };
    }
  }

  async withdraw(amount) {
    if (this.isSigned) {
      try {
        await this.contract.withdraw(amount);
        return { success: true, message: "" };
      } catch (e) {
        if (e.data.message === WithdrawlError) {
          return { success: false, message: WithdrawlError };
        }
        console.log("withdrawErr: ", e);
        return { success: false, message: UnknownError };
      }
    } else {
      return { success: false, message: NeedSignerError };
    }
  }

  checkIsSigned() {
    return this.isSigned;
  }

  getContract() {
    return this.contract;
  }

  getContractAddr() {
    return this.contractAddr;
  }

  getProvider() {
    if (this.isSigned) {
      return null;
    }
    return this.provider;
  }

  getSigner() {
    if (this.isSigned) {
      return this.signer;
    }
    return null;
  }
}
