#!/bin/bash

curl -X POST -H "Content-type: application/json" -d '{"username":"bolzon","password":"superheroes"}' -i localhost:3000/auth
