#!/bin/bash

########Network Start##############
echo "Delete previous user data in wallet"
rm -rf wallet/*

echo "Down previous network"
cd test-network
./network.sh down

echo "Create channel&DB"
./network.sh up createChannel -ca -s couchdb

echo "Install chaincode"
./network.sh deployCC -ccn fabcar -ccv 1 -cci initLedger -ccl java -ccp ../chaincode/chaincode/java/
cd ../
