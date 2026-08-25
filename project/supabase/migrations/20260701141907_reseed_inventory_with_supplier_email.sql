
/*
# Reseed Inventory — Authoritative Dataset with Supplier Email

## Summary
Wipes all existing product rows and reseeds the full 78-item Bookers
catalogue from the authoritative CSV. Also updates the Bookers supplier
record with the confirmed contact email address saikishorejammu@gmail.com.

## Changes
- DELETE all rows from `products` table (full wipe).
- UPDATE `suppliers` SET email = 'saikishorejammu@gmail.com' WHERE name = 'Bookers'.
- INSERT all 78 products with correct ingredient IDs, names, categories
  (derived from item context), package sizes (from CSV Category column),
  and placeholder wholesale prices.
*/

-- Wipe existing products
DELETE FROM products;

-- Set confirmed supplier email for Bookers
UPDATE suppliers SET email = 'saikishorejammu@gmail.com' WHERE name = 'Bookers';

-- Reinsert full catalogue
INSERT INTO products (ingredient_id, name, supplier_id, category, package_size, price)
SELECT
  v.ingredient_id,
  v.name,
  s.id,
  v.category,
  v.package_size,
  v.price
FROM (VALUES
  ('ING-001','Betty Crocker Indulgent Chocolate Fudge Icing 400g','Baking & Confectionery','4 x 400g',6.50),
  ('ING-002','Billington''s Dark Brown Soft Natural Unrefined Cane Sugar 500g','Baking & Confectionery','10 x 500g',8.00),
  ('ING-003','Billington''s Light Brown Soft Natural Unrefined Cane Sugar 3kg','Baking & Confectionery','1 x 3kg',4.50),
  ('ING-004','Billington''s Light Brown Soft Natural Unrefined Cane Sugar 500g','Baking & Confectionery','10 x 500g',8.00),
  ('ING-005','Biscoff Biscuit Crumbs 750g','Baking & Confectionery','8 x 750g',22.00),
  ('ING-006','Cadbury Drinking Hot Chocolate Large Tub 2KG','Baking & Confectionery','1 x 2kg',12.50),
  ('ING-007','CaterPro 100 Wooden Dessert Spoons','Packaging & Equipment','1 x 100s',3.50),
  ('ING-008','CaterPro 100 Wooden Forks','Packaging & Equipment','1 x 100s',3.50),
  ('ING-009','Chef''s Essentials Chopped Tomatoes in Tomato Juice 2.5kg','Condiments & Sauces','6 x 2.5kg',15.00),
  ('ING-010','Chef''s Larder Lightly Salted Tortilla Chips 454g','Condiments & Sauces','6 x 454g',9.00),
  ('ING-011','Chef''s Larder Salt 6kg','Condiments & Sauces','1 x 6kg',5.50),
  ('ING-012','Chef''s Larder White Wine Vinegar 2 Litres','Condiments & Sauces','1 x 2ltr',3.50),
  ('ING-013','Chef''s Menu Blackened Cajun Seasoning 590g','Condiments & Sauces','1 x 590g',5.00),
  ('ING-014','Chef''s Menu Cayenne Pepper 460g','Condiments & Sauces','1 x 460g',4.50),
  ('ING-015','Chef''s Menu Chipotle Sauce 1 Litre','Condiments & Sauces','6 x 1ltr',18.00),
  ('ING-016','Chef''s Menu Ground Black Pepper 500g','Condiments & Sauces','1 x 500g',4.00),
  ('ING-017','Chef''s Menu Ground Sweet Cinnamon 430g','Condiments & Sauces','1 x 430g',4.50),
  ('ING-018','Chef''s Menu Onion Powder 480g','Condiments & Sauces','1 x 480g',4.50),
  ('ING-019','Chef''s Menu Salsa 1 Litre','Condiments & Sauces','1 x 1ltr',4.00),
  ('ING-020','Chef''s Menu Smoked Paprika 430g','Condiments & Sauces','1 x 430g',4.50),
  ('ING-021','Cif Lemon Cream Cleaner 500ml','Cleaning & Hygiene','8 x 500ml',12.00),
  ('ING-022','CleanPro 10 Scouring Pads','Cleaning & Hygiene','1 x 10pk',2.50),
  ('ING-023','CleanPro 10 Stainless Steel Scourers Medium','Cleaning & Hygiene','1 x 10pk',3.00),
  ('ING-024','CleanPro+ Heavy Duty Cleaner Degreaser 5 Litres','Cleaning & Hygiene','2 x 5ltr',20.00),
  ('ING-025','CleanPro+ Oven and Grill Cleaner 1 Litre','Cleaning & Hygiene','1 x 1ltr',8.50),
  ('ING-026','Clearly 100 Blue Vinyl Powder-Free Gloves (Large)','Cleaning & Hygiene','10 x 100pk',18.00),
  ('ING-027','Coca-Cola Original Taste 330ml','Drinks & Beverages','24 x 330ml',14.00),
  ('ING-028','Comelle Ice Cream Mix 1 Litre','Dairy & Alternatives','12 x 1ltr',22.00),
  ('ING-029','Curtis Catering Chopped Mixed Nuts 1kg','Baking & Confectionery','1 x 1kg',8.50),
  ('ING-030','Diet Coke 330ml Glass Bottles','Drinks & Beverages','24 x 330ml',16.00),
  ('ING-031','Dr. Oetker Baking Powder 170g','Baking & Confectionery','4 x 170g',5.00),
  ('ING-032','Dr. Oetker Madagascan Vanilla Extract 35ml','Baking & Confectionery','6 x 35ml',10.00),
  ('ING-033','Fairy Professional Washing Up Liquid Original 900ml','Cleaning & Hygiene','6 x 900ml',15.00),
  ('ING-034','Fanta Orange 330ml','Drinks & Beverages','24 x 330ml',14.00),
  ('ING-035','Flash Professional All Purpose Cleaner 5L','Cleaning & Hygiene','2 x 5L',18.00),
  ('ING-036','Frank''s Red Hot Wings Buffalo Sauce 3.78L','Condiments & Sauces','1 x 3.7ltr',16.00),
  ('ING-037','Heinz Professional Mayonnaise 10L','Condiments & Sauces','1 x 10ltr',28.00),
  ('ING-038','Heinz Tomato Ketchup 4.5kg','Condiments & Sauces','2 x 4ltr',22.00),
  ('ING-039','Hershey''s Cookies ''N'' Creme 40g','Baking & Confectionery','24 x 40g',15.00),
  ('ING-040','Huel Banana Flavour Ready-to-Drink Complete Meal 500ml','Drinks & Beverages','8 x 500ml',22.00),
  ('ING-041','J2O Apple & Mango 275ml','Drinks & Beverages','12 x 275ml',12.00),
  ('ING-042','J2O Apple & Raspberry 275ml','Drinks & Beverages','12 x 275ml',12.00),
  ('ING-043','J2O Orange & Passion Fruit 275ml','Drinks & Beverages','12 x 275ml',12.00),
  ('ING-044','Jack Rabbit Signature Collection Malbec Red Wine 75cl','Drinks & Beverages','6 x 75cl',40.00),
  ('ING-045','Jack''s Pure Apple Juice 1 Litre','Drinks & Beverages','6 x 1ltr',8.00),
  ('ING-046','JR Foods & Packaging Services 7" Pizza Box Plain Brown (100pcs)','Packaging & Equipment','1 x 100pk',22.00),
  ('ING-047','Koffmann''s Potatoes for Chefs Les Pommes Frites (4 x 2.27kg)','Frozen & Prepared','4 x 2.27kg',18.00),
  ('ING-048','KTC Crispy Fried Onions 400g','Condiments & Sauces','1 x 400g',3.50),
  ('ING-049','Lichfields Fairtrade White Sugar 2kg','Baking & Confectionery','1 x 2kg',2.50),
  ('ING-050','Maltesers Milk Chocolate Bag 37g','Baking & Confectionery','40 x 37g',20.00),
  ('ING-051','McCain Original Choice Potato Hash Browns 1kg','Frozen & Prepared','1 x 1kg',5.50),
  ('ING-052','McCain Potato Pops 2.5kg','Frozen & Prepared','1 x 2.5kg',8.00),
  ('ING-053','McVitie''s Digestives The Original Biscuits 360g','Baking & Confectionery','12 x 360g',14.00),
  ('ING-054','Mini Eggs 3kg','Baking & Confectionery','1 x 3kg',15.00),
  ('ING-055','Monin Caramel Syrup 100cl / 70cl','Drinks & Beverages','1 x 1ltr',8.50),
  ('ING-056','Mrs Elswood Burger Gherkins 670g','Condiments & Sauces','6 x 670g',12.00),
  ('ING-057','Muller Mullerlicious Whole Milk 2 Litre','Dairy & Alternatives','4 x 2ltr',6.00),
  ('ING-058','Muller Semi Skimmed Milk 2 Litres','Dairy & Alternatives','4 x 2ltr',6.00),
  ('ING-059','Nic Caramel Mini Fudge Cubes 1kg','Baking & Confectionery','1 x 1kg',7.00),
  ('ING-060','Nic Sugar Strands Vegan 1.0kg','Baking & Confectionery','1 x 1kg',5.50),
  ('ING-061','Oatly Oat Drink Barista Edition 1L Long Life','Dairy & Alternatives','6 x 1ltr',12.00),
  ('ING-062','OREO Original Vanilla Sandwich Biscuits 154g','Baking & Confectionery','16 x 154g',14.00),
  ('ING-063','Passoa Passion Fruit Liqueur 70cl','Drinks & Beverages','1 x 70cl',18.00),
  ('ING-064','Paterson''s Shortbread Fingers 300g','Baking & Confectionery','14 x 300g',16.00),
  ('ING-065','Perfect Ted Ceremonial Grade Matcha 100g','Drinks & Beverages','1 x 100g',18.00),
  ('ING-066','Roquito Hot Honey 720g','Condiments & Sauces','5 x 720g',22.00),
  ('ING-067','Silver Spoon British Icing Sugar 3kg','Baking & Confectionery','1 x 3kg',4.00),
  ('ING-068','Silver Spoon Granulated Sugar 1kg','Baking & Confectionery','15 x 1kg',12.00),
  ('ING-069','Snow Shock Blue Raspberry Premium Slush Syrup 5 Litres','Drinks & Beverages','1 x 5ltr',15.00),
  ('ING-070','Spice Magic Raita Sauce 930g','Condiments & Sauces','1 x 930g',4.50),
  ('ING-071','Spice Magic Smooth Mango Chutney 1.2kg','Condiments & Sauces','1 x 1.2kg',5.00),
  ('ING-072','Sprite Zero Sugar 330ml','Drinks & Beverages','24 x 330ml',14.00),
  ('ING-073','St Pierre 4 Pre-Sliced Brioche Burger Buns','Bakery & Bread','9 x 4pk',18.00),
  ('ING-074','St Pierre 4 Seeded Brioche Burger Buns','Bakery & Bread','9 x 4pk',18.00),
  ('ING-075','St Pierre Brioche Loaf 500g','Bakery & Bread','1 x 500g',3.50),
  ('ING-076','Strathmore Sparkling Spring Water 330ml','Drinks & Beverages','24 x 330ml',8.00),
  ('ING-077','Strathmore Still Spring Water 330ml / 750ml','Drinks & Beverages','24 x 330ml',8.00),
  ('ING-078','Sweetex Calorie Free Sweeteners 1200 Tablets','Baking & Confectionery','12 x 1200pk',20.00)
) AS v(ingredient_id, name, category, package_size, price)
JOIN suppliers s ON s.name = 'Bookers';
