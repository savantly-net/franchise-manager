DO $$
BEGIN
	ALTER TABLE fm_location ADD COLUMN smallware type varchar(200);
	ALTER TABLE fm_location ADD COLUMN kes type varchar(200);
	ALTER TABLE fm_location ADD COLUMN realestatetype type varchar(200);
	ALTER TABLE fm_location ADD COLUMN stage type varchar(200);
	ALTER TABLE fm_location ADD COLUMN distributioncenter type varchar(200);
	ALTER TABLE fm_location ADD COLUMN training type varchar(200);

EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;
