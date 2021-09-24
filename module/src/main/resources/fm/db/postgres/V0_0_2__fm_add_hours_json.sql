DO $$
BEGIN

  BEGIN
    ALTER TABLE fm_location ADD COLUMN hours jsonb;
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'fm_location.hours column already exists';
  END;
END $$;

DROP TABLE IF EXISTS fm_operating_hours CASCADE;