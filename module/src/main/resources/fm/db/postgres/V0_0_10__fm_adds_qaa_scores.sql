CREATE TABLE IF NOT EXISTS fm_qaa_score
(
    submission_id character varying(42) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    available_points bigint,
    na_points bigint,
    required_points bigint,
    scored_points bigint,
    CONSTRAINT fm_qaa_score_pkey PRIMARY KEY (submission_id)
);

CREATE TABLE IF NOT EXISTS fm_qaa_score_section
(
    submission_id character varying(42) NOT NULL,
    section_id character varying(42) NOT NULL,
    category_id character varying(42) NOT NULL,
    section_order bigint,
    section_name character varying(255),
    category_name character varying(255),
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    available_points bigint,
    na_points bigint,
    required_points bigint,
    scored_points bigint,
    CONSTRAINT fm_qaa_score_section_pkey PRIMARY KEY (submission_id, section_id, category_id)
);

CREATE TABLE IF NOT EXISTS fm_qaa_score_tag
(
    submission_id character varying(42) NOT NULL,
    tag character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    available_points bigint,
    na_points bigint,
    required_points bigint,
    scored_points bigint,
    CONSTRAINT fm_qaa_score_tag_pkey PRIMARY KEY (submission_id, tag)
);
