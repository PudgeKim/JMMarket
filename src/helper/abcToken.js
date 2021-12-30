import { ethers } from "ethers";
import { NeedSignerError } from "./errors";

const abi = [
  "function balanceOf(address) public view returns(uint256)",
  "function approve(address, uint256) public returns(bool)",
];

export class AbcToken {
  constructor(contractAddr, rpc) {
    this.contractAddr = contractAddr;
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
    this.contract = new ethers.Contract(this.contractAddr, abi, this.provider);
    this.isSigned = false;
  }

  checkIsSigned() {
    return this.isSigned;
  }

  setContractWithSigner(signer) {
    this.contract = new ethers.Contract(this.contractAddr, abi, signer);
    this.isSigned = true;
  }

  async balanceOf(address) {
    try {
      const balance = await this.contract.balanceOf(address);
      return { success: true, message: balance.toString() };
    } catch (e) {
      return { success: false, message: e };
    }
  }

  async approve(spender, amount) {
    if (this.isSigned) {
      try {
        const res = await this.contract.approve(spender, amount);
        return { success: true, message: res };
      } catch (e) {
        return { success: false, message: e };
      }
    } else {
      return { success: false, message: NeedSignerError };
    }
  }
}
