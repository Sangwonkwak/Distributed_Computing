/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.fabcar;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Item {
    public enum ItemState {
        YET,
        ON_SALE,
        DONE
    }

    @Property()
    private final String name;

    @Property()
    private final String owner;

    @Property
    private final ItemState state;

    @Property()
    private final int price;

    public String getName() {
        return name;
    }

    public String getOwner() {
        return owner;
    }

    public ItemState getState() {
        return state;
    }

    public int getPrice() {
        return price;
    }


    public Item(@JsonProperty("name") final String name, @JsonProperty("owner") final String owner,
    @JsonProperty("state") final ItemState state, @JsonProperty("price") final int price) {
        this.name = name;
        this.owner = owner;
        this.state = state;
        this.price = price;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Item other = (Item) obj;

        return Objects.deepEquals(new String[] {getName(), getOwner()},
                new String[] {other.getName(), other.getOwner()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(), getOwner());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@"
        + Integer.toHexString(hashCode()) + " [name=" + name + ", owner=" + owner + "]";
    }
}
