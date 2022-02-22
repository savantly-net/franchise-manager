DO $$
BEGIN
	ALTER TABLE fm_location ALTER COLUMN phonenumber type varchar(100);
END $$;
