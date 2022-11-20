#!/bin/sh

npm login

rm -rf dist

tsc --build

cp package.json dist

npm publish --access=public

cd ..

npm logout