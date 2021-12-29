pragma solidity ^0.8.4;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
// import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract MarioNFT is ERC1155, Ownable {

    struct SellOrder {
        address owner;
        uint256 orderId;
        uint256 nftId; 
        uint256 price; // ABC 토큰 몇개에 팔지
        uint256 date;
    }

    event LottoEvent(address _from, address indexed _to, uint256 nftId, uint256 abcTokenAmount);
    event SellNftEvent(address indexed _seller, uint256 indexed orderId, uint256 nftId, uint256 price);
    event BuyNftEvent(address indexed _buyer, uint256 indexed orderId, uint256 nftId, uint256 price);
    
    // 로또시에 해당 nft가 다 팔렸을 때 이 contract가 가지고 있는 ABC토큰을 비율에 맞게 줌
    // 예를 들어 MARIO nft가 당첨됬는데 수량이 없다면 사용자는 아래 공식만큼의 ABC토큰을 받음
    // (현재 이 contract가 가지고 있는 ABC토큰) * (_exchangeRatio[MARIO]/100)
    // _exchange[MARIO] = 10이므로 현재 10개의 ABC토큰을 가지고 있다면 로또를 한 사용자는 1개의 ABC토큰을 받음
    mapping(uint256 => uint256) private _exchangeRatio;


    // 현재 판매가 진행중인 nft들
    //      orderId
    mapping(uint256 => SellOrder) public nftSoldMap;
    
    // 판매중인 모든 nft orderId
    uint256[] private _allOrderIdList;

    // nft판매자가 deposit한 nft들 수량
    //                         nftId       amount
    mapping(address => mapping(uint256 => uint256)) private _sellerNftBalances;
    
    // nft판매자가 판매중인 nft들의 orderIdList
    mapping(address => uint256[]) private _sellerOrdersMap;

    // nft판매자가 nft판매한 금액
    //                 balance
    mapping(address => uint256) private _sellerTokenBalances;

    string public baseURI;
    address public abcTokenAddress;
    uint256 private nextBondId = 0;
    uint256 private nextOrderId = 0;

    // NFT가 판매될 때 10%의 수수료가 이 contract로 감
    uint constant FEE = 10;    

    uint constant MARIO = 1;
    uint constant LUIGI = 2;
    uint constant DENO = 3;
    uint constant GORILLA = 4;
    uint constant RARE_MARIO = 5;
    uint constant RARE_LUIGI = 6;
    uint constant RARE_DENO = 7;

    uint constant MARIO_TOTAL_AMOUNT = 100;
    uint constant LUIGI_TOTAL_AMOUNT = 100;
    uint constant DENO_TOTAL_AMOUNT = 70;
    uint constant GORILLA_TOTAL_AMOUNT = 70;
    uint constant RARE_MARIO_TOTAL_AMOUNT = 30;
    uint constant RARE_LUIGI_TOTAL_AMOUNT = 30;
    uint constant RARE_DENO_TOTAL_AMOUNT = 7;

    // nftId => totalAmount
    mapping(uint256 => uint) private nftTotalAmountMap;

    constructor(string memory _baseURI, address _abcTokenAddress) ERC1155(_baseURI) {
        baseURI = _baseURI;
        abcTokenAddress = _abcTokenAddress;

        _setExchangeRatio();
        _setNftTotalAmountMap();

        _mint(address(this), MARIO, MARIO_TOTAL_AMOUNT, "");
        _mint(address(this), LUIGI, LUIGI_TOTAL_AMOUNT, "");
        _mint(address(this), DENO, DENO_TOTAL_AMOUNT, "");
        _mint(address(this), GORILLA, GORILLA_TOTAL_AMOUNT, "");

        _mint(address(this), RARE_MARIO, RARE_MARIO_TOTAL_AMOUNT, "");
        _mint(address(this), RARE_LUIGI, RARE_LUIGI_TOTAL_AMOUNT, "");
        _mint(address(this), RARE_DENO, RARE_DENO_TOTAL_AMOUNT, "");
    }

    function uri(uint256 tokenId) override public view returns(string memory) {
        return string (
            abi.encodePacked(
                baseURI,
                Strings.toString(tokenId),
                ".json"
            )
        );
    }

    function getNftOrTokenByLotto() payable external {
        // 0.1 MATIC 확인 (lotto price)
        require(msg.value == 100000000000000000, "you must pay 0.1 MATIC");
        uint8 randomNumber = _getRandomNumber();

        if (randomNumber>=0 && randomNumber<60) {
            _giveNftOrToken(MARIO, msg.sender);
        } else if (randomNumber>=60 && randomNumber<120) {
            _giveNftOrToken(LUIGI, msg.sender);
        } else if (randomNumber>=120 && randomNumber<160) {
            _giveNftOrToken(DENO, msg.sender);
        } else if (randomNumber>=160 && randomNumber<200) {
            _giveNftOrToken(GORILLA, msg.sender);
        } else if (randomNumber>=200 && randomNumber<224) {
            _giveNftOrToken(RARE_MARIO, msg.sender);
        } else if (randomNumber>=224 && randomNumber<248) {
            _giveNftOrToken(RARE_LUIGI, msg.sender);
        } else {
            _giveNftOrToken(RARE_DENO, msg.sender);
        }
    }

    function _depositNft(uint nftId) private {
        _checkNftBalance(msg.sender, nftId);
        // approve받아야 아래 코드가 실행됨 (msg.sender여서 approve 필요없는듯)
        _sendNft(msg.sender, address(this), nftId);
        _sellerNftBalances[msg.sender][nftId]++;
    }

    // seller가 판매금 출금
    function withdraw(uint256 amount) public {
        require(_sellerTokenBalances[msg.sender] >= amount, "The withdrawl amount couldn't be higher than your total balance");
        _sendAbcToken(msg.sender, amount);
        _sellerTokenBalances[msg.sender] -= amount;
    }

    function sellNft(uint256 nftId, uint256 price) public {
        require(nftId <= 7, "nftId must be lower than 8");
        _depositNft(nftId);
        _checkTraderNftBalance(msg.sender, nftId);  

        nextOrderId++;
        nftSoldMap[nextOrderId] = SellOrder(
            msg.sender,
            nextOrderId,
            nftId,
            price,
            block.timestamp
        );             

        _allOrderIdList.push(nextOrderId);
        _sellerOrdersMap[msg.sender].push(nextOrderId);

        emit SellNftEvent(msg.sender, nextOrderId, nftId, price);
    }

    function buyNft(uint256 orderId, uint256 price) public {
        require(nftSoldMap[orderId].orderId != 0, "orderId does not exist");
        require(msg.sender != nftSoldMap[orderId].owner, "you can't buy your nft");
        _checkTokenBalance(msg.sender, price);

        // 유저로부터 돈을 받고 (approve 필요함!)
        IERC20(abcTokenAddress).transferFrom(msg.sender, address(this), price);
        
        uint256 nftId = nftSoldMap[orderId].nftId;

        // 판매자가 deposit한 nft 수량 1 감소시킴
        address seller = nftSoldMap[orderId].owner;
        _sellerNftBalances[seller][nftId]--;

        // map에서도 삭제
        delete nftSoldMap[orderId];

        // _sellerOrdersMap에서도 해당 orderId 삭제해줌
        _deleteOrderIdFromList(_sellerOrdersMap[seller], orderId);
        // 모든 orderList에서도 삭제해줌
        _deleteOrderIdFromList(_allOrderIdList, orderId);

        // 판매자가 deposit한 nft 줌
        _sendNft(address(this), msg.sender, nftId);

        // 판매자 잔고 업데이트 (100wei 이상일 때 수수료 받음)
        if (price < 100) {
            _sellerTokenBalances[seller] += price;
            emit BuyNftEvent(msg.sender, orderId, nftId, price);
        } else {
            uint256 fee = price * FEE / 100;
            _sellerTokenBalances[seller] += (price-fee);
            emit BuyNftEvent(msg.sender, orderId, nftId, price);
        }
    }

    function getAllSellingNftList() external view returns(SellOrder[] memory) {
        SellOrder[] memory allSellOrders = new SellOrder[](_allOrderIdList.length);

        for (uint i=0; i<_allOrderIdList.length; i++) {
            uint256 orderId = _allOrderIdList[i];
            allSellOrders[i] = nftSoldMap[orderId];
        }
        return allSellOrders;
    }

    function getSellingNftList() external view returns(SellOrder[] memory) {
        uint256[] memory orderIds = _sellerOrdersMap[msg.sender];
        SellOrder[] memory sellingNftList = new SellOrder[](orderIds.length);

        for (uint i=0; i<orderIds.length; i++) {
            uint256 orderId = orderIds[i];
            SellOrder memory sellOrder = nftSoldMap[orderId];
            sellingNftList[i] = sellOrder;
        }
        return sellingNftList;
    }

    function getSellerNftBalance(address _address, uint256 nftId) external view returns(uint256) {
        uint256 amount = _sellerNftBalances[_address][nftId];
        return amount;
    }

    function getSellerTokenBalance() external view returns(uint256) {
        return _sellerTokenBalances[msg.sender];
    }

    function getNftCurrentAmount(uint256 nftId) public view returns(uint) {
        return balanceOf(address(this), nftId);
    }

    // nftId가 1부터므로 array length = 8 (idx0은 사용안함)
    function getAllNftCurrentAmount() external view returns(uint[8] memory) {
        uint[8] memory nftCurAmounts;
        for (uint i=1; i<8; i++) {
            nftCurAmounts[i] = getNftCurrentAmount(i);
        }
        return nftCurAmounts;
    }

    function getAllNftTotalAmount() external view returns(uint[8] memory) {
        uint[8] memory nftAmounts;
        for (uint i=1; i<8; i++) {
            nftAmounts[i] = nftTotalAmountMap[i];
        }
        return nftAmounts;
    }

    function getContractBalance() external view returns(uint256) {
        return _getABCTokenBalance(address(this));
    }
    

    function _deleteOrderIdFromList(uint256[] storage orderList, uint256 orderId) private {
        uint256[] storage orderIds = orderList;
        uint targetIdx;
        uint lastIdx = orderIds.length - 1;
        for (uint i=0; i<orderIds.length; i++) {
            if (orderId == orderIds[i]) {
                targetIdx = i;
            }
        }

        uint256 tmp = orderIds[lastIdx];
        orderIds[lastIdx] = orderIds[targetIdx];
        orderIds[targetIdx] = tmp;

        orderIds.pop();
    }

    // it is not real random
    function _getRandomNumber() private view returns(uint8) {
        bytes32 randomHash = keccak256(abi.encodePacked(block.difficulty, block.timestamp));
        // 16진수이므로 최대 255
        return uint8(randomHash[31]);
    }

    // 로또한 유저에게 nft를 줌 
    // nft 수량이 다 떨어졌으면 토큰을 줌
    function _giveNftOrToken(uint256 nftTokenId, address to) private {
        require(nftTokenId < 8, "tokenId must be lower than 8");
        uint256 nftTokenAmount = balanceOf(address(this), nftTokenId);
        
        if (nftTokenAmount > 0) {
            _sendNft(address(this), to, nftTokenId);
            emit LottoEvent(address(this), to, nftTokenId, 0);
        } else {
            uint256 abcTokenAmount = _getABCTokenBalance(address(this));

            // 설정된 토큰 교환비 가져옴
            uint256 abcRatio = _exchangeRatio[nftTokenId];
            uint256 prize = abcTokenAmount * (100-abcRatio) / 100;
             if (prize == 0) {
                emit LottoEvent(address(this), to, 0, 0);
                return;
            }

            _sendAbcToken(to, prize);
            emit LottoEvent(address(this), to, 0, prize);
        }
    }

    // 로또시에 해당 nft가 다 팔렸을 때 이 contract가 가지고 있는 ABC토큰을 비율에 맞게 줌
    // 예를 들어 MARIO nft가 당첨됬는데 수량이 없다면 사용자는 아래 공식만큼의 ABC토큰을 받음
    // (현재 이 contract가 가지고 있는 ABC토큰) * 10/100 (10%)
    function _setExchangeRatio() private {
        _exchangeRatio[MARIO] = 10;
        _exchangeRatio[LUIGI] = 10;
        _exchangeRatio[DENO] = 15;
        _exchangeRatio[GORILLA] = 20;
        _exchangeRatio[RARE_MARIO] = 35;
        _exchangeRatio[RARE_LUIGI] = 35;
        _exchangeRatio[RARE_DENO] = 75;
    }

    function _sendNft(address from, address to, uint256 nftId) private {
         if (from == address(this)) {
            // safeTransferFrom을 쓰면 address(this)가 msg.sender가 아니라 require에 걸림
            _safeTransferFrom(address(this), to, nftId, 1, "");
         } else {
             safeTransferFrom(from, to, nftId, 1, "");
         }
    }

    function _sendAbcToken(address to, uint256 amount) private {
        IERC20(abcTokenAddress).transfer(to, amount);
    }

    function _getABCTokenBalance(address addressToCheck) private view returns(uint256) {
        return IERC20(abcTokenAddress).balanceOf(addressToCheck);
    }

    // traderTokenBalances와는 상관없음
    function _checkTokenBalance(address addressToCheck, uint256 amount) private view {
        uint256 currentBalance = _getABCTokenBalance(addressToCheck);
        
        if (addressToCheck == address(this)) {
            require(currentBalance >= amount, "Not enough balance to exchange bond to token");
        } else {
            require(currentBalance >= amount, "Not enough balance");
        }
    }

    // traderNftBalances와는 상관없음
    function _checkNftBalance(address addressToCheck, uint256 nftId) private view {
        uint256 currentBalance = balanceOf(addressToCheck, nftId);
        require(currentBalance > 0, "not enough nft balance");
    }

    // deposit한 nft 수량 확인용
    function _checkTraderNftBalance(address addressToCheck, uint256 nftId) private view {
        uint256 currentBalance = _sellerNftBalances[addressToCheck][nftId];
        require(currentBalance > 0, "Not enough nft deposit");
    }

    function _setNftTotalAmountMap() private {
        nftTotalAmountMap[MARIO] = MARIO_TOTAL_AMOUNT;
        nftTotalAmountMap[LUIGI] = LUIGI_TOTAL_AMOUNT;
        nftTotalAmountMap[DENO] = DENO_TOTAL_AMOUNT;
        nftTotalAmountMap[GORILLA] = GORILLA_TOTAL_AMOUNT;
        nftTotalAmountMap[RARE_MARIO] = RARE_MARIO_TOTAL_AMOUNT;
        nftTotalAmountMap[RARE_LUIGI] = RARE_LUIGI_TOTAL_AMOUNT;
        nftTotalAmountMap[RARE_DENO] = RARE_DENO_TOTAL_AMOUNT;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    // test function
    function getNft(uint256 nftId) external {
        _sendNft(address(this), msg.sender, nftId);
    }

    function getSell() external view returns(uint256[] memory) {
        return _sellerOrdersMap[msg.sender];
    }

    function checkSender() external view returns(address) {
        return msg.sender;
    }

}