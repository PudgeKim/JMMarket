import { ethers } from "ethers";

export const contractAddress = "0x5C2840A403192beBe98Cf6113BF07Cc30aEA7164";

export const rpc = "https://rpc-mumbai.maticvigil.com/";
export const rpcAlchemy =
  "https://polygon-mumbai.g.alchemy.com/v2/ihAk8v60WilF57aj9Jh0baultadb1IaI";
export const provider = new ethers.providers.JsonRpcProvider(rpc);

export const abi = [
  "event LottoEvent(address _from, address indexed _to, uint256 nftId, uint256 abcTokenAmount)",
  "event SellNftEvent(address indexed _seller, uint256 indexed orderId, uint256 nftId, uint256 price)",
  "function balanceOf(address, uint256) external view returns(uint256)",
  "function setApprovalForAll(address, bool) external",
  "function getNftAmount(uint256) public view returns(uint)",
  "function getAllNftCurrentAmount() external view returns(uint[8] memory)",
  "function getAllNftTotalAmount() external view returns(uint[8] memory)",
  "function uri(uint256) override public view returns(string memory)",
  "function getNftOrTokenByLotto() payable external",
  "function sellNft(uint256, uint256) public",
  "function buyNft(uint256, uint256) public",
  "function withdraw(uint256) public",
  "function getSellerNftBalance(address, uint256) external view returns(uint256)",
  "function getSellerTokenBalance() external view returns(uint256)",
  "function getAllSellingNftList() external view returns(SellOrder[] memory)",
  "function getSellingNftList() external view returns(SellOrder[] memory)",
  "function getContractBalance() external view returns(uint256)",
];
