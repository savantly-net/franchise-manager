DO $$
BEGIN
	ALTER TABLE fm_qaa_submission ADD COLUMN fsm varchar(100);

EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;
