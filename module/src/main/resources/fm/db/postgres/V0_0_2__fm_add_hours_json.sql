DO $$
BEGIN
	ALTER TABLE fm_location ADD COLUMN hours jsonb;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'fm_location.hours column already exists';
END $$;

DROP TABLE IF EXISTS fm_operating_hours CASCADE;