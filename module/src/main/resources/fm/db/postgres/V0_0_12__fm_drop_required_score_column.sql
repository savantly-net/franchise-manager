DO $$
BEGIN
	ALTER TABLE fm_qaa_score drop COLUMN IF EXISTS required_points;
	ALTER TABLE fm_qaa_score_section drop COLUMN IF EXISTS required_points;
	ALTER TABLE fm_qaa_score_tag drop COLUMN IF EXISTS required_points;
END $$;
