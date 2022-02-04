DO $$
BEGIN
	ALTER TABLE fm_location ADD COLUMN smallware varchar(200);
	ALTER TABLE fm_location ADD COLUMN kes varchar(200);
	ALTER TABLE fm_location ADD COLUMN realestatetype varchar(200);
	ALTER TABLE fm_location ADD COLUMN stage varchar(200);
	ALTER TABLE fm_location ADD COLUMN distributioncenter varchar(200);
	ALTER TABLE fm_location ADD COLUMN training varchar(200);

EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;
