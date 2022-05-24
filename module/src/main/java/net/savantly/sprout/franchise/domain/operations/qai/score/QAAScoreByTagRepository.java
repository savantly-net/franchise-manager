package net.savantly.sprout.franchise.domain.operations.qai.score;

import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QAAScoreByTagRepository extends JpaRepository<QAAScoreByTag, QAAScoreByTagId> {
    
    @Transactional
    void deleteBySubmissionId(String submissionId);

    Set<QAAScoreByTag> findBySubmissionId(String id);
}
