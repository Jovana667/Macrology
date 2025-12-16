-- Add UNIQUE constraint to foods.name for duplicate prevention
ALTER TABLE foods ADD CONSTRAINT foods_name_unique UNIQUE (name);
