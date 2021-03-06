#!/bin/bash
node-git-info
cat git.properties >> version.html
cp version.html ./dist/
if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi

docker build -t gennyproject/alyson-v3:${version} .
