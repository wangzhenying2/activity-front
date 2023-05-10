#!/bin/sh

BASE=`pwd`

#package check
python bin/precheck.py

#2 调用nodejs 并保存临时文件
npm run build


