var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

const contract_address = "0x67031812F6e3E27F5d90c7c908F7042e0c044a6a";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "item_name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Auction_bidding",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "item_name",
				"type": "string"
			}
		],
		"name": "Auction_end",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "item_name",
				"type": "string"
			}
		],
		"name": "Due_over",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "item_name",
				"type": "string"
			}
		],
		"name": "Register_item",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "Register_name",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "auctionBidding",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "fill",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "item",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "cur_price",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "cur_bidder",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "upper_limit_price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "due_date",
						"type": "uint256"
					}
				],
				"internalType": "struct IAuction.RegisteredItem",
				"name": "item",
				"type": "tuple"
			}
		],
		"name": "auctionEnd",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address payable",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "balanceTransfer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllAuctionedItems",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "fill",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "item",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "winning_bid",
						"type": "uint256"
					}
				],
				"internalType": "struct IAuction.AuctionedItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllRegisteredItems",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "fill",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "item",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "cur_price",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "cur_bidder",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "upper_limit_price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "due_date",
						"type": "uint256"
					}
				],
				"internalType": "struct IAuction.RegisteredItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMyItems",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getName_2",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "getTransedTime",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint16",
						"name": "year",
						"type": "uint16"
					},
					{
						"internalType": "uint8",
						"name": "month",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "day",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "hour",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "minute",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "second",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "weekday",
						"type": "uint8"
					}
				],
				"internalType": "struct DateTime._DateTime",
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "parseTimestamp",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint16",
						"name": "year",
						"type": "uint16"
					},
					{
						"internalType": "uint8",
						"name": "month",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "day",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "hour",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "minute",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "second",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "weekday",
						"type": "uint8"
					}
				],
				"internalType": "struct DateTime._DateTime",
				"name": "dt",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "start_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"name": "registerAuctionItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "registerItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "registerName",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
let auction = new web3.eth.Contract(abi, contract_address);

$(document).ready(function() {
	startDapp();
})

var startDapp = async function() {
	getMyItems();
	getRegisteredAuctionItems();
	getClosedAuctionItems();
	getItemsRegisteredAtAuction();
	getName();
}


var getBalance = function() {
	var address = $('#address').text();
	web3.eth.getBalance(address, function (error, balance) {
		if (!error)
			$('#balanceAmount').text(web3.utils.fromWei(balance,'ether'));
		else
			console.log('error: ', error);
	});
}

var getName = async function() {
	
	var address = $('#address').text();
	var name = await auction.methods.getName().call({from:address});
	document.getElementById("name").innerHTML = name;
}

var registerName = async function() {
	
	var address = $('#address').text();
	var name = await document.getElementById("change_name").value;
	await auction.methods.registerName(name).send({from:address, gas:5 * Math.pow(10,5)});
	getName();
}


var registerForMyItem = async function() {
	var address = $('#address').text();
	var item_name = await document.getElementById("Item").value;
	await auction.methods.registerItem(item_name).send({from:address, gas:5 * Math.pow(10,5)});
	getMyItems();
}

var registerAuctionItem = async function() {
	var address = $('#address').text();
	var target = await document.getElementById("myitems-category");
	var name = target.options[target.selectedIndex].text;
	var start_price = await document.getElementById("startingBidPrice").value;
	var upper_limit = await document.getElementById("upperLimitPrice").value;
	var target2 = await document.getElementById("time-term");
	var term = target2.options[target2.selectedIndex].id;
	var num;

	if(term == "minute")
		num = 1;
	else if(term == "hour")
		num = 60;
	else if(term == "day")
		num = 60*24;
	else if(term == "week")
		num = 60*24*7;
	else;
	var due_date = num * await document.getElementById("dueDate").value;

	await auction.methods.registerAuctionItem(name,start_price,upper_limit,due_date).send({from:address, gas:5 * Math.pow(10,5)});
	getItemsRegisteredAtAuction();
	getRegisteredAuctionItems();

}

var auctionBidding = async function() {
	var address = $('#address').text();
	var target = await document.getElementById("auction-category");
	var name = target.options[target.selectedIndex].text;
	var bid_price = await document.getElementById("bidPrice").value;

	await auction.methods.auctionBidding(name,bid_price).send({from:address, gas:5 * Math.pow(10,6), value:bid_price * Math.pow(10,18)});
	alert(bid_price);

	getRegisteredAuctionItems();
	getClosedAuctionItems();
}

var getMyItems = async function() {
	var address = $('#address').text();
	var items = await auction.methods.getMyItems().call({from:address});
	var result = "";

	for(var i=0;i<items.length;i++)
	 	result += "<tr> <td>" + items[i].toString() + "</td> </tr>";
	document.getElementById("myItems").innerHTML = result;

	getMyItemsToBeAuctioned();
}

var getRegisteredAuctionItems = async function() {
	var address = $('#address').text();
	var items = await auction.methods.getAllRegisteredItems().call({from:address});
	var result = "";
	
	for(var i=0;i<items.length;i++){
		var owner = await auction.methods.getName_2(items[i].owner).call({from:address});
		var due_date = await auction.methods.getTransedTime(items[i].due_date).call({from:address});
		var due_str = "" + due_date.year.toString() + "/" + due_date.month.toString() + "." + due_date.day.toString() + "/" + due_date.hour.toString() + ":" + due_date.minute.toString();
		result += "<tr><td>" + items[i].item + "</td><td>"  + owner + "</td><td>" + items[i].cur_price.toString() + "</td><td>" + items[i].upper_limit_price.toString() + "</td><td>" + due_str + "</td></tr>";
	}
	document.getElementById("registeredCars").innerHTML = result;
}

var getClosedAuctionItems = async function() {
	var address = $('#address').text();
	var items = await auction.methods.getAllAuctionedItems().call({from:address});
	var result = "";

	for(var i=0;i<items.length;i++){
		owner = await auction.methods.getName_2(items[i].owner).call({from:address});
		result += "<tr> <td>" + items[i].item + "</td> <td>" + owner + "</td> <td>" + items[i].winning_bid.toString() + "</td> </tr>";
	}
	document.getElementById("carsOnSale").innerHTML = result;
}

var getMyItemsToBeAuctioned = async function() {
	var address = $('#address').text();
	var items = await auction.methods.getMyItems().call({from:address});
	var result = "";

	for(var i=0;i<items.length;i++)
		result += "<option>" + items[i].toString() + "</option>";
	document.getElementById("myitems-category").innerHTML = result;
}

var getItemsRegisteredAtAuction = async function() {
	var address = $('#address').text();
	var items = await auction.methods.getAllRegisteredItems().call({from:address});
	var result = "";

	for(var i=0;i<items.length;i++)
		result += "<option>" + items[i].item + "</option>";
	document.getElementById("auction-category").innerHTML = result;
}



