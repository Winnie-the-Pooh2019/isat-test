#!/bin/bash

while getopts brp flag; do
    case "${flag}" in
    b) build=1 ;;
    r) run=1 ;;
    p) push=1 ;;
    ?)
        print_usage
        exit 1
        ;;
    esac
done

if [[ "$build" == "1" ]]; then
    docker build . -t ivanch1ck/node-mongo
fi
if [[ "$run" == "1" ]]; then
    docker run -p 3000:3000 -it ivanch1ck/node-mongo
fi
if [[ "$push" == "1" ]]; then
    docker push ivanch1ck/node-mongo
fi