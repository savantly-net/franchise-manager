DO $$
BEGIN
	ALTER TABLE fm_qai_question ADD COLUMN tags varchar(500);

EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;
