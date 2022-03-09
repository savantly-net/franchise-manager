CREATE TABLE IF NOT EXISTS fm_qaa_submission
(
    id character varying(42) NOT NULL,
    location_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    date_scored timestamp without time zone,
    manager_on_duty character varying(255),
    fsc character varying(255),
    responsible_alcohol_cert character varying(255),
    CONSTRAINT fm_qaa_submission_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS fm_qaa_submission_sections
(
    qaa_submission_id character varying(42) NOT NULL,
    section_id character varying(255) NOT NULL
);

