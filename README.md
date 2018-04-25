[Big]: https://mikemcl.github.io/big.js/
[Pug]: https://pugjs.org/

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
/reports/
/tempates/
/tempates/Food/
/tempates/Food/html.pug
/tempates/Food/query.sql
```

### Create PDF report

```shell
$ reportsdb toPDF ./examples/templates/Food/
```

### Create CSV report

```shell
$ reportsdb toCSV ./examples/templates/Food/
```

### Create HTML report

```shell
$ reportsdb toHTML ./examples/templates/Food/
```
