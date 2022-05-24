package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QAASectionScoreRepository extends JpaRepository<QAASectionScore, QAASectionScoreId> {
    
    @Transactional
    void deleteBySubmissionId(String submissionId);

    Set<QAASectionScore> findBySubmissionId(String submissionId);
}
