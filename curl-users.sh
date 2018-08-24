#!/bin/bash

curl -X GET -H "Authorization: bearer $1" localhost:3000/users
