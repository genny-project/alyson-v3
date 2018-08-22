#!/bin/bash

if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi


docker push gennyproject/alyson-v3:${version}
docker tag  gennyproject/alyson-v3:${version} gennyproject/alyson-v3:latest
docker push gennyproject/alyson-v3:latest

