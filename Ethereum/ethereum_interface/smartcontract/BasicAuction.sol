pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./IAuction.sol";

contract BasicAuction is IAuction{
    
    mapping(address => string[]) internal _myItem;
    mapping(address => string) IM;
    mapping(string => RegisteredItem) RItem;
    string[] RItem_list;
    mapping(string => AuctionedItem) AItem;
    string[] AItem_list;
    
    function registerName(string memory name) public{
        IM[msg.sender] = name;
        emit Register_name(name);
    }
    
    function registerItem(string memory name) public{
        require(RItem[name].fill == false,"This item already registered!");
        require(AItem[name].fill == false,"This item already closed!");
        
        _myItem[msg.sender].push(name);
        emit Register_item(name);
    }
    
    function _registerItem(string memory name) internal{
        _myItem[msg.sender].push(name);
    }
    
    function registerAuctionItem(string memory name, uint start_price, uint limit_price, uint date) public{
        require(start_price < limit_price,"Price problem.");
        
        RegisteredItem storage temp = RItem[name];
        temp.fill = true;
        temp.item = name;
        temp.owner = msg.sender;
        temp.cur_price = start_price;
        temp.cur_bidder = address(0);
        temp.upper_limit_price = limit_price;
        temp.due_date = date* 1 minutes + now;
        
        RItem_list.push(name);
    }
    
    function auctionBidding(string memory name, uint value) payable public{
        RegisteredItem storage item = RItem[name];
        if(now >= item.due_date){
            emit Due_over(name);
            // payback
            address payable dont = address(uint160(msg.sender));
            balanceTransfer(dont,value);
            
            auctionEnd(item);
            return ;
        }
    
        require(item.cur_price < value, "Bidding price should be higher than current bidding price!");
        
        // Payback previous bidding price to previous bidder
        if(item.cur_bidder != address(0)){
            address payable pre_bidder = address(uint160(item.cur_bidder));
            balanceTransfer(pre_bidder, item.cur_price);
        }
        
        item.cur_price = value;
        item.cur_bidder = msg.sender;
        emit Auction_bidding(msg.sender,name,value);
        if(value >= item.upper_limit_price){
            item.cur_price = item.upper_limit_price;
            address payable cur_bidder = address(uint160(item.cur_bidder));
            balanceTransfer(cur_bidder, value - item.cur_price);
            auctionEnd(item);
        }
        
    }
    
    function auctionEnd(RegisteredItem memory item) payable public{
        // Normal ending case
        if(item.cur_bidder != address(0)){
            // Transfer ether
            address payable seller = address(uint160(item.owner));
            uint price = item.cur_price;
            balanceTransfer(seller, price);
            
            // Change owner
            changeItemOwner(item);
        }
            
        // When nobody bid until due date
        else{
            RegToAuc(item,item.owner);
        }
        
        emit Auction_end(item.item); 
        
    }
    
    function balanceTransfer(address payable seller, uint price) payable public{
        uint eth = price * 10**18;
        seller.transfer(eth);
    }
    
    function changeItemOwner(RegisteredItem memory item) internal{
        string[] storage temp = _myItem[item.owner];
        string memory name = item.item;
        uint i;
        
        //Remove item from original owner's item list
        for(i=0;i<temp.length;i++){
            if(keccak256(abi.encodePacked(temp[i])) == keccak256(abi.encodePacked(name))){
                delete temp[i];
                temp[i] = temp[temp.length-1];
                temp.length -= 1;
                break;
            }
        }
        
        // Register item
        _registerItem(name);
        
        // RItem to AItem and change owner
        RegToAuc(item,msg.sender);
    }
    
    function RegToAuc(RegisteredItem memory item, address who) internal{
        // Add to AuctionedItem
        string memory name = item.item;
        
        AuctionedItem storage tmp_a = AItem[name];
        tmp_a.fill = true;
        tmp_a.item = name;
        tmp_a.owner = who;
        tmp_a.winning_bid = item.cur_price;
        AItem_list.push(name);
        
        // Remove from RegisteredItem
        string[] storage temp = RItem_list;
        uint i;
        
        for(i=0;i<temp.length;i++){
            if(keccak256(abi.encodePacked(temp[i])) == keccak256(abi.encodePacked(name))){
                delete temp[i];
                temp[i] = temp[temp.length-1];
                temp.length -= 1;
                break;
            }
        }
        delete RItem[name];
    }
    
    function getMyItems() public view returns(string[] memory){
        return _myItem[msg.sender];
    }
    
    function getName() public view returns(string memory){
        return IM[msg.sender];
    }
    
    function getName_2(address owner) public view returns(string memory){
        return IM[owner];
    }
    
    function getAllRegisteredItems() public view returns(RegisteredItem[] memory){
        RegisteredItem[] memory result = new RegisteredItem[](RItem_list.length);
        uint i;
        
        for(i=0;i<result.length;i++)
            result[i] = RItem[RItem_list[i]];
        
        return result;
    }
    
    function getAllAuctionedItems() public view returns(AuctionedItem[] memory){
        AuctionedItem[] memory result = new AuctionedItem[](AItem_list.length);
        uint i;
        
        for(i=0;i<result.length;i++)
            result[i] = AItem[AItem_list[i]];
        
        return result;
    }
    
    function getTransedTime(uint time) public view returns(_DateTime memory){
        _DateTime memory temp = parseTimestamp(time);
        uint num = (temp.hour + 9) / 24;
        temp.hour = (temp.hour + 9) % 24;
        temp.day += uint8(num);
        
        return temp;
    }
    
} 
