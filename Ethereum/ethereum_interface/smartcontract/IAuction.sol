pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./DateTime.sol";

contract IAuction is DateTime{
    
    struct RegisteredItem{
        bool fill;
        string item;
        address owner;
        uint cur_price;
        address cur_bidder;
        uint upper_limit_price;
        uint due_date;
    }
    struct AuctionedItem{
        bool fill;
        string item;
        address owner;
        uint winning_bid;
    }
    
    event Register_name(string indexed name);
    event Register_item(string indexed item_name);
    event Auction_bidding(address indexed bidder,string indexed item_name,uint value);
    event Transfer(address indexed from, address indexed to, uint value);
    event Due_over(string indexed item_name);
    event Auction_end(string indexed item_name);
    
    function registerName(string memory name) public;
    function registerItem(string memory name) public;
    function _registerItem(string memory name) internal;
    function registerAuctionItem(string memory name, uint start_price, uint limit_price, uint date) public;
    function auctionBidding(string memory name, uint value) payable public;
    function auctionEnd(RegisteredItem memory item) payable public;
    function balanceTransfer(address payable seller, uint price) payable public;
    function changeItemOwner(RegisteredItem memory item) internal;
    function RegToAuc(RegisteredItem memory item, address who) internal;
    function getMyItems() public view returns(string[] memory);
    function getName() public view returns(string memory);
    function getName_2(address owner) public view returns(string memory);
    function getAllRegisteredItems() public view returns(RegisteredItem[] memory);
    function getAllAuctionedItems() public view returns(AuctionedItem[] memory);
    function getTransedTime(uint time) public view returns(_DateTime memory);
}