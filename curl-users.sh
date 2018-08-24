#!/bin/bash

curl -X GET -H "Authorization: bearer $1" -i localhost:3000/users
