#!/bin/sh

set -eu

yarn workspace @fastpoker/client build
rm -rf server/public || true
cp -vr client/build server/public
