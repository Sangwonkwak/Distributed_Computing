/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.fabcar;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Number {

    @Property()
    private final int inum;
    @Property()
    private final int unum;

    public int getInum() {
        return inum;
    }

    public int getUnum() {
        return unum;
    }

    public Number(@JsonProperty("inum") final int inum,
    @JsonProperty("unum") final int unum) {
        this.inum = inum;
        this.unum = unum;
    }

}
