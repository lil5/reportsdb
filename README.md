[Big]: https://mikemcl.github.io/big.js/
[Pug]: https://pugjs.org/

[![GitHub license](https://img.shields.io/github/license/lil5/reportsdb.svg)](https://github.com/lil5/reportsdb/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/reportsdb.svg)](https://www.npmjs.com/package/reportsdb)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

# ReportsDB

Create reports from an sqlite datebase and a template using `SQL` and [`Pug`][Pug] with [`Big.js`][Big] JavaScript math.

These reports can be rendered in:
* PDF
* CSV
* HTML

## Install

```shell
$ npm i -g reportsdb
```

## Commands

### Help

```shell
$ reportsdb -h
$ reportsdb toPDF -h
```

### Create project by copying the example

```shell
$ reportsdb init .
```

This will create a boilerplate on which to work on.

```
/db.sqlite
/.editorconfig
/files/
/reports/
/scripts/
/scripts/inputFood.sh
/templates/
/templates/Food/
/templates/Food/html.pug
/templates/Food/query.sql
```
### Create report

Generating a report will read the `html.pug` and `query.sql` inside the given template directory. Output file is located in `reports`.

> Filtering is possible by year `-y <YYYY>` (and quater `-q <Q>`). A `--select <column>` option is required. The `--select` option will also reorder by said column date (with or without year (& quater) filter).

#### PDF

```shell
$ reportsdb toPDF ./examples/templates/Food/
```

#### CSV

```shell
$ reportsdb toCSV ./examples/templates/Food/
```

#### HTML

```shell
$ reportsdb toHTML ./examples/templates/Food/
```
