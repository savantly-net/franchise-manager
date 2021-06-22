CREATE TABLE fm_address_book
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    CONSTRAINT fm_address_book_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_bar
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    beer boolean NOT NULL,
    linearfeet integer NOT NULL,
    liquor boolean NOT NULL,
    standalone boolean NOT NULL,
    CONSTRAINT fm_bar_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_building
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    bohsquarefeet integer NOT NULL,
    fohsquarefeet integer NOT NULL,
    leasesigndate date,
    maxoccupancy integer NOT NULL,
    maxseating integer NOT NULL,
    totalsquarefeet integer NOT NULL,
    CONSTRAINT fm_building_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_calendar
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    allday boolean NOT NULL,
    fromdate timestamp without time zone,
    text character varying(15000),
    title character varying(255),
    todate timestamp without time zone,
    CONSTRAINT fm_calendar_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_contact_type
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    displayname character varying(255),
    enabled boolean NOT NULL,
    CONSTRAINT fm_contact_type_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_fee_type
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    assignmenttype character varying(255),
    defaultamount numeric(19,2),
    deleted boolean NOT NULL,
    description character varying(255),
    enabled boolean NOT NULL,
    feeamounttype character varying(255),
    name character varying(255),
    recurring boolean NOT NULL,
    recurringinterval character varying(255),
    CONSTRAINT fm_fee_type_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_fee
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    enddate date,
    locationid character varying(255),
    overrideamount numeric(15,6),
    startdate date,
    storeid character varying(255),
    feetype_item_id character varying(42),
    feetype_tenant_id character varying(255),
    CONSTRAINT fm_fee_pkey PRIMARY KEY (item_id, tenant_id),
    CONSTRAINT fk7q5wipli1ax86ol3agrqj7i0d FOREIGN KEY (feetype_item_id, feetype_tenant_id)
        REFERENCES fm_fee_type (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_group
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    address1 character varying(255),
    address2 character varying(255),
    city character varying(255),
    name character varying(255),
    state character varying(255),
    zip character varying(255),
    CONSTRAINT fm_group_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_group_member
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    franchisegroupid character varying(255),
    role character varying(255),
    userid character varying(255),
    CONSTRAINT fm_group_member_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_integration_type
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    description character varying(255),
    displayname character varying(255),
    enabled boolean NOT NULL,
    CONSTRAINT fm_integration_type_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_knowledge
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    text character varying(15000),
    title character varying(255),
    CONSTRAINT fm_knowledge_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_operating_hours
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    fridayclose time without time zone,
    fridayopen time without time zone,
    mondayclose time without time zone,
    mondayopen time without time zone,
    saturdayclose time without time zone,
    saturdayopen time without time zone,
    sundayclose time without time zone,
    sundayopen time without time zone,
    thursdayclose time without time zone,
    thursdayopen time without time zone,
    tuesdayclose time without time zone,
    tuesdayopen time without time zone,
    wednesdayclose time without time zone,
    wednesdayopen time without time zone,
    CONSTRAINT fm_operating_hours_pkey PRIMARY KEY (item_id, tenant_id)
);


CREATE TABLE fm_pos
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    physicalterminals integer NOT NULL,
    virtualterminals integer NOT NULL,
    CONSTRAINT fm_pos_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_location
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    address1 character varying(100),
    address2 character varying(100),
    city character varying(100),
    concept character varying(255),
    country character varying(100),
    emailaddress character varying(100),
    groupid character varying(100),
    locationtype character varying(255),
    marketid character varying(100),
    name character varying(100),
    notes character varying(255),
    onlineorderingstartdate timestamp without time zone,
    phonenumber bigint,
    state character varying(100),
    zip character varying(20),
    building_item_id character varying(42),
    building_tenant_id character varying(255),
    hours_item_id character varying(42),
    hours_tenant_id character varying(255),
    pos_item_id character varying(42),
    pos_tenant_id character varying(255),
    CONSTRAINT fm_location_pkey PRIMARY KEY (item_id, tenant_id),
    CONSTRAINT fk4p4l27379b1rbigl3yhjga06t FOREIGN KEY (pos_item_id, pos_tenant_id)
        REFERENCES fm_pos (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkmbua0o8kalyl1yh5990g70iad FOREIGN KEY (hours_tenant_id, hours_item_id)
        REFERENCES fm_operating_hours (tenant_id, item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fknh0yfscyumh3vvkgvrdopttw5 FOREIGN KEY (building_item_id, building_tenant_id)
        REFERENCES fm_building (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_location_fm_bar
(
    franchiselocation_item_id character varying(42) NOT NULL,
    franchiselocation_tenant_id character varying(255) NOT NULL,
    bars_item_id character varying(42) NOT NULL,
    bars_tenant_id character varying(255) NOT NULL,
    CONSTRAINT fm_location_fm_bar_pkey PRIMARY KEY (franchiselocation_item_id, franchiselocation_tenant_id, bars_item_id, bars_tenant_id),
    CONSTRAINT uk_4j8top0dwcbbholftk00muv2p UNIQUE (bars_item_id, bars_tenant_id),
    CONSTRAINT fkcatlarp8wj9agvcyloa97oy1t FOREIGN KEY (franchiselocation_tenant_id, franchiselocation_item_id)
        REFERENCES fm_location (tenant_id, item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkne2g0jsgv16rln3vrn068oo1f FOREIGN KEY (bars_item_id, bars_tenant_id)
        REFERENCES fm_bar (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_operating_hours_modifier
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    closetime time without time zone,
    datetomodify date,
    opentime time without time zone,
    CONSTRAINT fm_operating_hours_modifier_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_location_fm_operating_hours_modifier
(
    franchiselocation_item_id character varying(42) NOT NULL,
    franchiselocation_tenant_id character varying(255) NOT NULL,
    modifiedhours_item_id character varying(42) NOT NULL,
    modifiedhours_tenant_id character varying(255) NOT NULL,
    CONSTRAINT fm_location_fm_operating_hours_modifier_pkey PRIMARY KEY (franchiselocation_item_id, franchiselocation_tenant_id, modifiedhours_item_id, modifiedhours_tenant_id),
    CONSTRAINT uk_3j08opw6tmtf2211m71k8dfob UNIQUE (modifiedhours_item_id, modifiedhours_tenant_id),
    CONSTRAINT fkl1m6dfsyhtrx4myjv8udr5v8r FOREIGN KEY (modifiedhours_item_id, modifiedhours_tenant_id)
        REFERENCES fm_operating_hours_modifier (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fksefliqijd7ldb79fvjtg7igb9 FOREIGN KEY (franchiselocation_tenant_id, franchiselocation_item_id)
        REFERENCES fm_location (tenant_id, item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_patio
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    totalsquarefeet integer NOT NULL,
    CONSTRAINT fm_patio_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_location_fm_patio
(
    franchiselocation_item_id character varying(42) NOT NULL,
    franchiselocation_tenant_id character varying(255) NOT NULL,
    patios_item_id character varying(42) NOT NULL,
    patios_tenant_id character varying(255) NOT NULL,
    CONSTRAINT fm_location_fm_patio_pkey PRIMARY KEY (franchiselocation_item_id, franchiselocation_tenant_id, patios_item_id, patios_tenant_id),
    CONSTRAINT uk_deyiryd296y39k5i4940rtyl8 UNIQUE (patios_item_id, patios_tenant_id),
    CONSTRAINT fk4go5g2cmcf05hbm317odu8ng5 FOREIGN KEY (franchiselocation_tenant_id, franchiselocation_item_id)
        REFERENCES fm_location (tenant_id, item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkso27lbirx3nxy3wquqfiu4lim FOREIGN KEY (patios_item_id, patios_tenant_id)
        REFERENCES fm_patio (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_location_member
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    locationid character varying(255),
    role character varying(255),
    userid character varying(255),
    CONSTRAINT fm_location_member_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_market
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    name character varying(255),
    CONSTRAINT fm_market_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_newsletter
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    text character varying(15000),
    title character varying(255),
    CONSTRAINT fm_newsletter_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_newsletter_template
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    text character varying(15000),
    title character varying(255),
    CONSTRAINT fm_newsletter_template_pkey PRIMARY KEY (item_id, tenant_id)
);


CREATE TABLE fm_owner
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    enddate timestamp without time zone,
    groupid character varying(255),
    incorporatedname character varying(255),
    locationid character varying(255),
    startdate timestamp without time zone,
    storeid bigint NOT NULL,
    CONSTRAINT fm_owner_pkey PRIMARY KEY (item_id, tenant_id)
);


CREATE TABLE fm_qai_guest_question
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    deleted boolean NOT NULL,
    item_order integer,
    points integer NOT NULL,
    sectionid character varying(255),
    text character varying(500),
    CONSTRAINT fm_qai_guest_question_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_qai_guest_question_answer
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    guestquestionid character varying(255),
    value character varying(255),
    CONSTRAINT fm_qai_guest_question_answer_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_qai_guest_question_answer_group
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    notes character varying(2000),
    CONSTRAINT fm_qai_guest_question_answer_group_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_qai_guest_question_answer_group_fm_qai_guest_question_answer
(
    qaiguestquestionanswergroup_item_id character varying(42) NOT NULL,
    qaiguestquestionanswergroup_tenant_id character varying(255) NOT NULL,
    answers_item_id character varying(42) NOT NULL,
    answers_tenant_id character varying(255) NOT NULL,
    CONSTRAINT uk_qmief1lb4k6vdrnnr0whnd8es UNIQUE (answers_item_id, answers_tenant_id),
    CONSTRAINT fk6y5amwkvwe86ur9i07rk12e0g FOREIGN KEY (answers_item_id, answers_tenant_id)
        REFERENCES fm_qai_guest_question_answer (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkahnlgxgsjfxbtitd4lrvhshe9 FOREIGN KEY (qaiguestquestionanswergroup_item_id, qaiguestquestionanswergroup_tenant_id)
        REFERENCES fm_qai_guest_question_answer_group (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_qai_question_category
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    name character varying(255),
    item_order integer,
    CONSTRAINT fm_qai_question_category_pkey PRIMARY KEY (item_id, tenant_id),
    CONSTRAINT uk340vue123b2rnq0ffnh7wolk UNIQUE (name, tenant_id)
);

CREATE TABLE fm_qai_question
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    deleted boolean NOT NULL,
    item_order integer,
    points integer NOT NULL,
    sectionid character varying(255),
    text character varying(1000),
    category_item_id character varying(42) NOT NULL,
    category_tenant_id character varying(255) NOT NULL,
    CONSTRAINT fm_qai_question_pkey PRIMARY KEY (item_id, tenant_id),
    CONSTRAINT fkom9gqd5ine9pgh8khdb929416 FOREIGN KEY (category_item_id, category_tenant_id)
        REFERENCES fm_qai_question_category (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_qai_question_answer
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    notes character varying(1500),
    questionid character varying(255),
    value character varying(255),
    CONSTRAINT fm_qai_question_answer_pkey PRIMARY KEY (item_id, tenant_id)
);


CREATE TABLE fm_qai_section
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    name character varying(255),
    item_order integer,
    requirestaffattendance boolean NOT NULL,
    CONSTRAINT fm_qai_section_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_qai_section_submission
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    datescored timestamp without time zone,
    locationid character varying(255),
    manageronduty character varying(255),
    sectionid character varying(255),
    status character varying(255),
    CONSTRAINT fm_qai_section_submission_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_qai_section_submission_fm_qai_guest_question_answer_group
(
    qaisectionsubmission_item_id character varying(42) NOT NULL,
    qaisectionsubmission_tenant_id character varying(255) NOT NULL,
    guestanswers_item_id character varying(42) NOT NULL,
    guestanswers_tenant_id character varying(255) NOT NULL,
    CONSTRAINT uk_jl10yps3w3hgmn1botfypbppu UNIQUE (guestanswers_item_id, guestanswers_tenant_id),
    CONSTRAINT fk9i2abj7n61pbqynvcpfodbtks FOREIGN KEY (qaisectionsubmission_item_id, qaisectionsubmission_tenant_id)
        REFERENCES fm_qai_section_submission (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fktnd3p0w87sxocayqmd3t66ad8 FOREIGN KEY (guestanswers_item_id, guestanswers_tenant_id)
        REFERENCES fm_qai_guest_question_answer_group (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_qai_section_submission_fm_qai_question_answer
(
    qaisectionsubmission_item_id character varying(42) NOT NULL,
    qaisectionsubmission_tenant_id character varying(255) NOT NULL,
    answers_item_id character varying(42) NOT NULL,
    answers_tenant_id character varying(255) NOT NULL,
    CONSTRAINT uk_qy8i8l6h0ssr5bmy9sbu5u8j6 UNIQUE (answers_item_id, answers_tenant_id),
    CONSTRAINT fk2kyvqobl4vsupbc5t9pplvuxm FOREIGN KEY (answers_item_id, answers_tenant_id)
        REFERENCES fm_qai_question_answer (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkgqkhr0ecvokufs45fepf4vbqd FOREIGN KEY (qaisectionsubmission_item_id, qaisectionsubmission_tenant_id)
        REFERENCES fm_qai_section_submission (item_id, tenant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_qai_staff_attendance
(
    tenant_id character varying(42) NOT NULL,
    item_id character varying(255) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL,
    CONSTRAINT fm_qai_staff_attendance_pkey PRIMARY KEY (tenant_id, item_id, name),
    CONSTRAINT fk4uv5lxsrxebsroqqrnr9hxrhk FOREIGN KEY (item_id, tenant_id)
        REFERENCES fm_qai_section_submission (tenant_id, item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE fm_qai_visit
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    formdataid character varying(255),
    locationid character varying(255),
    sectionsubmissionid character varying(255),
    CONSTRAINT fm_qai_visit_pkey PRIMARY KEY (item_id, tenant_id)
);

CREATE TABLE fm_report_source
(
    item_id character varying(42) NOT NULL,
    tenant_id character varying(255) NOT NULL,
    createdby character varying(255),
    createddate timestamp without time zone,
    lastmodifiedby character varying(255),
    lastmodifieddate timestamp without time zone,
    version bigint,
    menupath character varying(255),
    name character varying(255),
    sourcetype character varying(255),
    url character varying(255),
    icon character varying(255),
    template character varying(64000),
    templatetype character varying(255),
    weight bigint,
    CONSTRAINT fm_report_source_pkey PRIMARY KEY (item_id, tenant_id)
);



CREATE TABLE qaiguestquestionanswergroup_attachments (
	qaiguestquestionanswergroup_item_id varchar(42) NOT NULL,
	qaiguestquestionanswergroup_tenant_id varchar(255) NOT NULL,
	contenttype varchar(255) NULL,
	downloadurl varchar(255) NULL,
	id varchar(255) NULL,
	name varchar(255) NULL
);

ALTER TABLE qaiguestquestionanswergroup_attachments ADD CONSTRAINT fkf8tpbfsqdau0pdf8vy4yvpyb FOREIGN KEY (qaiguestquestionanswergroup_item_id, qaiguestquestionanswergroup_tenant_id) REFERENCES fm_qai_guest_question_answer_group(item_id, tenant_id);

CREATE TABLE qaiquestionanswer_attachments (
	qaiquestionanswer_item_id varchar(42) NOT NULL,
	qaiquestionanswer_tenant_id varchar(255) NOT NULL,
	contenttype varchar(255) NULL,
	downloadurl varchar(255) NULL,
	id varchar(255) NULL,
	"name" varchar(255) NULL
);

ALTER TABLE qaiquestionanswer_attachments ADD CONSTRAINT fksf85xmq12gyc5cax6oi3jgi2t FOREIGN KEY (qaiquestionanswer_item_id, qaiquestionanswer_tenant_id) REFERENCES fm_qai_question_answer(item_id, tenant_id);