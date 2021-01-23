/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.fabcar;

import java.util.ArrayList;
import java.util.List;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;
import com.owlike.genson.Genson;


@Contract(
        name = "TradeItem",
        info = @Info(
                title = "TradeItem contract",
                description = "The hyperlegendary Item contract",
                version = "0.0.1-SNAPSHOT",
                license = @License(
                        name = "Apache 2.0 License",
                        url = "http://www.apache.org/licenses/LICENSE-2.0.html"),
                contact = @Contact(
                        email = "f.carr@example.com",
                        name = "F Carr",
                        url = "https://hyperledger.example.com")))
@Default
public final class TradeItem implements ContractInterface {

    private final Genson genson = new Genson();

    private enum ItemErrors {
        ITEM_NOT_FOUND,
        ITEM_ALREADY_EXISTS
    }

    @Transaction()
    public void initLedger(final Context ctx) {

        adminToken(ctx);
        numInit(ctx);
    }

    @Transaction()
    private void adminToken(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();

        final int adminT = 1000000;
        Token token = new Token(adminT, "admin");
        String tokenState = genson.serialize(token);
        stub.putStringState("TOKEN1", tokenState);
    }

    @Transaction()
    private void numInit(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();

        // Item 0, User 1
        Number number = new Number(0, 1);
        String numberState = genson.serialize(number);
        stub.putStringState("NUMBER", numberState);
    }

    // return token number of owner, 0 means not that token in DB
    @Transaction()
    public int tokenNum(final Context ctx, final String owner) {
        ChaincodeStub stub = ctx.getStub();
        final String startKey = "TOKEN1";
        final String endKey = "TOKEN99";
        QueryResultsIterator<KeyValue> results = stub.getStateByRange(startKey, endKey);
        int i = 0;
        for (KeyValue result: results) {
            Token token = genson.deserialize(result.getStringValue(), Token.class);
            if (owner.equals(token.getOwner())) {
                return i + 1;
            }
            i++;
        }

        return 0;
    }

    @Transaction()
    public Token earnToken(final Context ctx, final String owner) {
        ChaincodeStub stub = ctx.getStub();

        if (tokenNum(ctx, owner) != 0) {
            String errorMessage = String.format("User already receive!");
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, "User already receive!");
        }
        final int freeToken = 100;
        String tokenState = stub.getStringState("TOKEN1");
        String numberState = stub.getStringState("NUMBER");
        Token admin = genson.deserialize(tokenState, Token.class);
        Number originNum = genson.deserialize(numberState, Number.class);
        Token token1 = new Token(freeToken, owner);
        Token token2 = new Token(admin.getToken() - freeToken, "admin");
        int unum = originNum.getUnum() + 1;
        Number number = new Number(originNum.getInum(), unum);
        String userKey = String.format("TOKEN%d", unum);

        // register user token
        tokenState = genson.serialize(token1);
        stub.putStringState(userKey, tokenState);
        // change admin token
        tokenState = genson.serialize(token2);
        stub.putStringState("TOKEN1", tokenState);
        // change NUMBER
        numberState = genson.serialize(number);
        stub.putStringState("NUMBER", numberState);

        return token1;
    }

    @Transaction()
    public Item registerItem(final Context ctx, final String name, final String owner) {
        ChaincodeStub stub = ctx.getStub();

        String numberState = stub.getStringState("NUMBER");
        Number originNum = genson.deserialize(numberState, Number.class);
        int inum = originNum.getInum() + 1;
        String key = String.format("ITEM%d", inum);
        Number number = new Number(inum, originNum.getUnum());
        Item item = new Item(name, owner, Item.ItemState.YET, 0);

        // register item
        String itemState = genson.serialize(item);
        stub.putStringState(key, itemState);
        // change NUMBER
        numberState = genson.serialize(number);
        stub.putStringState("NUMBER", numberState);

        return item;
    }

    @Transaction()
    public Item sellMyItem(final Context ctx, final String key, final int price) {
        ChaincodeStub stub = ctx.getStub();
        String itemState = stub.getStringState(key);
        if (itemState.isEmpty()) {
            String errorMessage = String.format("Item %s not found", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, ItemErrors.ITEM_NOT_FOUND.toString());
        }
        Item item = genson.deserialize(itemState, Item.class);
        Item newItem = new Item(item.getName(), item.getOwner(), Item.ItemState.ON_SALE, price);
        String newItemState = genson.serialize(newItem);
        stub.putStringState(key, newItemState);

        return newItem;
    }

    @Transaction()
    public Item buyUserItem(final Context ctx, final String key, final String newOwner) {
        ChaincodeStub stub = ctx.getStub();
        String itemState = stub.getStringState(key);

        if (itemState.isEmpty()) {
            String errorMessage = String.format("Item %s not found", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, ItemErrors.ITEM_NOT_FOUND.toString());
        }
        Item item = genson.deserialize(itemState, Item.class);
        int tokenN = tokenNum(ctx, newOwner);
        String tokenKey = String.format("TOKEN%d", tokenN);
        String tokenState = stub.getStringState(tokenKey);
        Token buyer = genson.deserialize(tokenState, Token.class);

        // check whether newOwner's money is enough
        if (item.getPrice() > buyer.getToken()) {
            String errorMessage = String.format("Short Money!");
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, "Short Money!");
        }

        // change buyer token
        Token newBuyer = new Token(buyer.getToken() - item.getPrice(), buyer.getOwner());
        tokenState = genson.serialize(newBuyer);
        stub.putStringState(tokenKey, tokenState);
        // change seller token
        tokenN = tokenNum(ctx, item.getOwner());
        tokenKey = String.format("TOKEN%d", tokenN);
        tokenState = stub.getStringState(tokenKey);
        Token seller = genson.deserialize(tokenState, Token.class);
        Token newSeller = new Token(seller.getToken() + item.getPrice(), seller.getOwner());
        tokenState = genson.serialize(newSeller);
        stub.putStringState(tokenKey, tokenState);

        return changeItemOwner(ctx, key, newOwner);
    }

    @Transaction()
    public Item changeItemOwner(final Context ctx, final String key, final String newOwner) {
        ChaincodeStub stub = ctx.getStub();
        String itemState = stub.getStringState(key);

        Item item = genson.deserialize(itemState, Item.class);
        Item newItem = new Item(item.getName(), newOwner, Item.ItemState.DONE, item.getPrice());
        String newItemState = genson.serialize(newItem);
        stub.putStringState(key, newItemState);

        return newItem;
    }

    @Transaction()
    public String getMyItems(final Context ctx, final String owner) {
        ChaincodeStub stub = ctx.getStub();

        final String startKey = "ITEM1";
        final String endKey = "ITEM99";
        List<ItemQueryResult> items = new ArrayList<ItemQueryResult>();
        QueryResultsIterator<KeyValue> results = stub.getStateByRange(startKey, endKey);

        for (KeyValue result: results) {
            Item item = genson.deserialize(result.getStringValue(), Item.class);

            if (owner.equals(item.getOwner())) {
                items.add(new ItemQueryResult(result.getKey(), item));
            }
        }
        final String response = genson.serialize(items);

        return response;
    }

    @Transaction()
    public String getAllItems(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();
        final String startKey = "ITEM1";
        final String endKey = "ITEM99";
        List<ItemQueryResult> items = new ArrayList<ItemQueryResult>();
        QueryResultsIterator<KeyValue> results = stub.getStateByRange(startKey, endKey);

        for (KeyValue result: results) {
            Item item = genson.deserialize(result.getStringValue(), Item.class);
            items.add(new ItemQueryResult(result.getKey(), item));
        }
        final String response = genson.serialize(items);

        return response;
    }

    @Transaction()
    public String getAllRegisteredItems(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();
        final String startKey = "ITEM1";
        final String endKey = "ITEM99";
        List<ItemQueryResult> items = new ArrayList<ItemQueryResult>();
        QueryResultsIterator<KeyValue> results = stub.getStateByRange(startKey, endKey);

        for (KeyValue result: results) {
            Item item = genson.deserialize(result.getStringValue(), Item.class);
            if (Item.ItemState.ON_SALE == item.getState()) {
                items.add(new ItemQueryResult(result.getKey(), item));
            }
        }
        final String response = genson.serialize(items);

        return response;
    }

    @Transaction()
    public String getAllOrderedItems(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();
        final String startKey = "ITEM1";
        final String endKey = "ITEM99";
        List<ItemQueryResult> items = new ArrayList<ItemQueryResult>();
        QueryResultsIterator<KeyValue> results = stub.getStateByRange(startKey, endKey);

        for (KeyValue result: results) {
            Item item = genson.deserialize(result.getStringValue(), Item.class);
            if (Item.ItemState.DONE == item.getState()) {
                items.add(new ItemQueryResult(result.getKey(), item));
            }
        }
        final String response = genson.serialize(items);

        return response;
    }
}
