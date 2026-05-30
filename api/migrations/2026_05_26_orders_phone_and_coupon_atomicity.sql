-- Merged into api/aurelia_database.sql (customer_phone + idx_customer_email).
-- Only run this if you imported an OLD schema without customer_phone:

-- ALTER TABLE `aurelia_orders`
--   ADD COLUMN `customer_phone` VARCHAR(40) NULL AFTER `customer_email`;
-- CREATE INDEX `idx_customer_email` ON `aurelia_customers` (`email`);
