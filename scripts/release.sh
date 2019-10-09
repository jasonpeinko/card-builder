#!/usr/bin/env sh

version=$(jq -r .version package.json)
git tag -a "v$version" -m "Version $version"
