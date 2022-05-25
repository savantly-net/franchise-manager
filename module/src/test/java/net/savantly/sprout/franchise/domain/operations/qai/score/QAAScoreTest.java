package net.savantly.sprout.franchise.domain.operations.qai.score;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class QAAScoreTest {

    @Test
    void test() {
        QAAScore score = new QAAScore();

        int availablePoints = 100;
        score.addAvailablePoints(availablePoints);

        int naPoints = 10;
        score.addNaPoints(naPoints);

        int scoredPoints = 90;
        score.addScorePoints(scoredPoints);

        String expected = "1.00";
        Assertions.assertEquals(expected, score.getOverallRating().toString());
    }
}
