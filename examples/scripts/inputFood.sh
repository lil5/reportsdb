#!/bin/bash

db="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../db.sqlite"

q() {
	rtn=''
	while [[ $qrtn == '' ]]; do
		echo $1
		read result
		qrtn=$result
	done
}

# Input

q "Name:"
name=$qrtn

echo ""
echo $(sqlite3 ./examples/db.sqlite 'SELECT id, name FROM FoodType')
q "Type: (number)"
type=$qrtn

q "Sell by: (YYYY-MM-DD)"
sellby=$qrtn

q "Price:"
price=$qrtn

q "vat:"
vat=$qrtn

# Insert
sqlite3 $db "INSERT INTO Food ( name, type, sellby, price, vat ) VALUES ('$name', $type, '$sellby', $price, $vat)"
