#!/bin/bash
cd $(dirname "$0")/..
file_dir=$(pwd)

cd $file_dir
git clone --depth 1 --branch feat-so https://github.com/Kanaries/gw-dsl-parser.git
cd gw-dsl-parser/so

go mod tidy
go build -buildmode=c-shared -o dsl_to_sql.so ./so_main.go
mv dsl_to_sql.so $file_dir
cd $file_dir
rm -rf gw-dsl-parser

ret=$?
exit $?

