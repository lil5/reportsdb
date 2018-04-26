SELECT Food.id, Food.name, FoodType.name AS type, Food.sellby, Food.price, Food.vat
FROM Food
INNER JOIN FoodType ON type = FoodType.id
