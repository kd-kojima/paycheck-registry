#!/bin/bash
ADDRESS="127.0.0.1"
PORT=8000
CWD=$(dirname $0)
cd $CWD
open -a 'Google Chrome' http://$ADDRESS:$PORT
python3 ./app.py $ADDRESS $PORT