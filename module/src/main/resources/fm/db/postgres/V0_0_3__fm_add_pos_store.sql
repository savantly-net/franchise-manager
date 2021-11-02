DO $$
BEGIN
	ALTER TABLE fm_location ADD COLUMN dateopened date;
	ALTER TABLE fm_location ADD COLUMN dateclosed date;
	ALTER TABLE fm_location drop COLUMN groupid;

	ALTER TABLE fm_owner ALTER COLUMN storeid type varchar(100);

	CREATE TABLE IF NOT EXISTS fm_owner_pos (
		item_id varchar(42) NOT NULL,
	    tenant_id varchar(255) NOT NULL,
	    createdby varchar(255),
	    createddate timestamp without time zone,
	    lastmodifiedby varchar(255),
	    lastmodifieddate timestamp without time zone,
	    version bigint,
	    startdate date,
	    enddate date,
	    storeid varchar(100) NOT NULL,
	    posid varchar(100) NOT NULL,
	    CONSTRAINT fm_owner_pos_pkey PRIMARY KEY (item_id, tenant_id)
	);
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END $$;
