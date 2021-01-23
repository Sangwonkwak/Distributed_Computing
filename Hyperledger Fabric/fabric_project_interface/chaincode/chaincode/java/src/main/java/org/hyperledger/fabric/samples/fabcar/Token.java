/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.fabcar;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Token {

    @Property()
    private final int token;

    @Property
    private final String owner;

    public int getToken() {
        return token;
    }

    public String getOwner() {
        return owner;
    }

    public Token(@JsonProperty("token") final int token, @JsonProperty("owner") final String owner) {
        this.token = token;
        this.owner = owner;
    }

}
