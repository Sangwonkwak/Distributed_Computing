var express = require('express');
var enroll = require('../fabric_js/enrollAdmin.js')
var register = require('../fabric_js/registerUser.js')
var query = require('../fabric_js/query.js')
var invoke = require('../fabric_js/invoke.js')
var router = express.Router();

let user;

/* GET home page. */
router.get('/', async function(req, res, next) {
	console.log('main page');
	var MyItems_result = "";
	var Sell_My_Items_result = "";
	var Buy_Users_Items_result = "";
	var registered_Items_result = "";
	var Items_on_sale_result = "";

	if(user != undefined){
		// My Items
		var items = await query.query('getMyItems',user);
		if(items != undefined){
			for(var i=0;i<items.length;i++){
				MyItems_result += "<tr> <td>" + items[i].key + "</td> <td>" + items[i].record['owner'] + "</td> <td>" + items[i].record['name'] + "</td> </tr>";
			}
		}
		// Sell My Items
		if(items != undefined){
			for(var i=0;i<items.length;i++){
				if(items[i].record['state'] == "YET" || items[i].record['state'] == 'DONE'){
					Sell_My_Items_result += "<option>" + items[i].key + "</option>";
				}
			}
		}
	}
	// Buy Users Items
	items = await query.query('getAllRegisteredItems', user);
	if(items != undefined){
		for(var i=0;i<items.length;i++){

			Buy_Users_Items_result += "<option>" + items[i].key + "</option>";
		}
	}
	// registered Items
	items = await query.query('getAllItems', user);
	if(items != undefined){
		for(var i=0;i<items.length;i++){
			registered_Items_result += "<tr> <td>" + items[i].key + "</td> <td>" + items[i].record['owner'] + "</td> <td>" + items[i].record['name'] + "</td> </tr>";
		}
	}
	// Items on sale
	items = await query.query('getAllRegisteredItems', user);
	if(items != undefined){
		for(var i=0;i<items.length;i++){
			Items_on_sale_result += "<tr> <td>" + items[i].key + "</td> <td>" + items[i].record['owner'] + "</td> <td>" + items[i].record['name'] + "</td> <td>" + items[i].record['price'] + "</td> <td>" + items[i].record['state'] + "</td> </tr>";
		}
	}
	items = await query.query('getAllOrderedItems', user);
	if(items != undefined){
		for(var i=0;i<items.length;i++){
			Items_on_sale_result += "<tr> <td>" + items[i].key + "</td> <td>" + items[i].record['owner'] + "</td> <td>" + items[i].record['name'] + "</td> <td>" + items[i].record['price'] + "</td> <td>" + items[i].record['state'] + "</td> </tr>";
		}
	}
	res.render('index', { name: req.cookies.user, myItems: MyItems_result, myItems_category: Sell_My_Items_result, sale_category: Buy_Users_Items_result, registeredItems: registered_Items_result, ItemOnSale: Items_on_sale_result});	
});

router.get('/enrollAdmin', async function(req, res, next) {
	await enroll.enrollAdmin();
	res.redirect('/');
})

router.post('/registerUser', async function(req, res, next) {
	user = req.body.user;
	await register.registerUser(user);
	res.cookie('user', user);
	res.redirect('/');
})

router.post('/earnToken', async function(req,res,next){
	await invoke.invoke('earnToken',user,'0');
	res.redirect('/');
})

router.post('/registerItem', async function(req,res,next){
	var item_name = req.body.name;
	if(item_name != ""){
		await invoke.invoke('registerItem',user,item_name);
	}
	res.redirect('/');
})

router.post('/sellMyItem', async function(req,res,next){
	var args = [];
	// key & price
	args[0] = req.body.demo_category;
	args[1] = String(req.body.price);
	if(args[1] != ""){
		await invoke.invoke('sellMyItem',user,args);
	}
	res.redirect('/');
})

router.post('/buyUserItem', async function(req,res,next){
	var args = req.body.demo_category;

	await invoke.invoke('buyUserItem',user,args);
	res.redirect('/');
})

module.exports = router;
