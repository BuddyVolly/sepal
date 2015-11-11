#!/usr/bin/env bash

CONTEXT_DIR=${1:-"."}
VERSION=${2:-"latest"}
INVENTORY_FILE_NAME=${3:-"ec2.py"}


INVENTORY_FILE_PATH="$CONTEXT_DIR"/"$INVENTORY_FILE_NAME"

ansible-playbook ${CONTEXT_DIR}/setup.yml \
    -i ${INVENTORY_FILE_PATH} \
    --private-key=~/.ssh/sepal/eu-central-1.pem \
    --extra-vars "region=eu-central-1"

${INVENTORY_FILE_PATH} --refresh-cache > /dev/null

ansible-playbook ${CONTEXT_DIR}/operations.yml \
    -i ${INVENTORY_FILE_PATH} \
    --private-key=~/.ssh/sepal/eu-central-1.pem \
    --extra-vars "region=eu-central-1 version=$VERSION secret_vars_file=~/.sepal/secret.yml"
