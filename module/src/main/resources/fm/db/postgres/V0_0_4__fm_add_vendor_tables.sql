CREATE TABLE IF NOT EXISTS fm_vendor
(
    id character varying(42) NOT NULL,
    name character varying(255) NOT NULL,
    typeid character varying(42),
    mailingaddress character varying(255),
    phonenumber character varying(20),
    emailaddress character varying(255),
    notes character varying(2000),

    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    CONSTRAINT fm_vendor_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS fm_vendor_type
(
    id character varying(42) NOT NULL,
    name character varying(255) NOT NULL,

    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    CONSTRAINT fm_vendor_type_pkey PRIMARY KEY (id)
);
