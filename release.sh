#!/usr/bin/env sh

version=jq .version package.json
git tag -a "v$version" -m "Version $version"
