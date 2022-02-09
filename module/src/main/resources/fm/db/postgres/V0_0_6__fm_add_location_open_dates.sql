CREATE TABLE IF NOT EXISTS fm_location_open_dates
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    startDate timestamp without time zone,
    endDate timestamp without time zone,
    CONSTRAINT fm_location_open_dates_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE IF NOT EXISTS fm_location_fm_location_open_dates
(
    franchiselocation_item_id character varying(42) NOT NULL,
    franchiselocation_tenant_id character varying(255) NOT NULL,
    opendateintervals_item_id character varying(42) NOT NULL,
    opendateintervals_tenant_id character varying(255) NOT NULL,
    CONSTRAINT fm_location_fm_location_open_dates_pkey PRIMARY KEY (franchiselocation_item_id, franchiselocation_tenant_id, opendateintervals_item_id, opendateintervals_tenant_id),
    CONSTRAINT fm_location_fm_location_open_dates_uk UNIQUE (opendateintervals_item_id, opendateintervals_tenant_id),
    CONSTRAINT fm_location_fm_location_open_dates_location_fk FOREIGN KEY (franchiselocation_tenant_id, franchiselocation_item_id)
        REFERENCES fm_location (tenant_id, item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fm_location_fm_location_open_dates_dates_fk FOREIGN KEY (opendateintervals_item_id, opendateintervals_tenant_id)
        REFERENCES fm_location_open_dates (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
