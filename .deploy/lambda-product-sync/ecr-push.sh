#!/bin/bash

TAG="$(git rev-parse HEAD)"
export TAG
export IMAGE=lambda-product-sync
export REGION=ap-northeast-2
export AWS_ACCOUNT_ID=423457115592

docker-compose -f docker-compose-build.yaml build build
docker tag $IMAGE:$TAG $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$IMAGE:$TAG
docker tag $IMAGE:$TAG $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$IMAGE:latest
