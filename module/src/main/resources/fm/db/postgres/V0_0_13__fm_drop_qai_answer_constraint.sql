DO $$
BEGIN
	ALTER TABLE fm_qai_section_submission_fm_qai_question_answer drop CONSTRAINT IF EXISTS fk2kyvqobl4vsupbc5t9pplvuxm;
	--ALTER TABLE fm_qai_section_submission_fm_qai_question_answer ADD FOREIGN KEY (answers_item_id, answers_tenant_id)
      --  REFERENCES fm_qai_question_answer (item_id, tenant_id) MATCH SIMPLE
        --ON UPDATE NO ACTION
        --ON DELETE CASCADE
	
END $$;
