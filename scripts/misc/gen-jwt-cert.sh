#!/bin/bash

# generates ecdsa secret for auth using secp521r1 curve

openssl ecparam -name secp521r1 -genkey -outform pem -noout -out ../../api/auth-pvtkey.pem
openssl pkey -in ../../api/auth-pvtkey.pem -pubout -out ../../api/auth-pubkey.pem
