ALTER TABLE user_profiles 
    ADD COLUMN target_calories DECIMAL(6,2),
    ADD COLUMN target_protein_g DECIMAL(6,2),
    ADD COLUMN target_fat_g DECIMAL(6,2),
    ADD COLUMN target_carbs_g DECIMAL(6,2),
    ADD COLUMN dietary_restrictions TEXT;

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);