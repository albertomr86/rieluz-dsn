DSN Parser for rieluz
=====================

DSN Parser to build config connection for rieluz lib.
see: https://github.com/joelmcs6/rieluz

[![Build Status](https://travis-ci.org/albertomr86/rieluz-dsn.svg?branch=master)](https://travis-ci.org/albertomr86/rieluz-dsn)

# Installation

`npm install rieluz-dsn`

# Usage

```javascript
var parse = require('rieluz-dsn');

// ES6
// import parse from 'rieluz-dsn';

var dsn = "orientdb://admin:admin123@localhost:2424/mydb?conn=default"
var rieluzConfig = parse(dsn);

// Use rieluzConfig when call .connect method
```

# DSN string format

`[orientdb:]//[<user>:<pass>@]localhost[:<port>]/<database>[?conn=<default>&servers=<host>[:<port>],<host>[:<port>],...]`

## DSN parts

| Component         | Description                                |
|-------------------|--------------------------------------------|
| driver            |               mongo:// or  //              |
| auth              |                 user:pass@                 |
| host              | 127.0.0.1:2424                             |
| database          | /test                                      |
| connection        | /?conn=default                             |
| dedicated servers | &servers=192.168.1.1:2425,192.168.1.2:2425 |

## Examples

`orientdb://localhost:2424/mydb`
`orientdb://localhost:2424/mydb?conn=default`
`orientdb://admin:admin@127.0.0.1:2424/mydb?conn=default`
`orientdb://admin:admin@127.0.0.1:2424/mydb?conn=default&servers=127.0.0.1:2425`
`orientdb://admin:admin@192.168.1.1:2424/mydb?conn=default&servers=192.168.1.1:2425,192.168.1.2:2425`
