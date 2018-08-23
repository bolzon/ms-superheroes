#!/bin/bash

# generates ecdsa secret for auth using secp521r1 curve

openssl ecparam -name secp521r1 -genkey -outform der -noout -out ../api/auth-secret.der
