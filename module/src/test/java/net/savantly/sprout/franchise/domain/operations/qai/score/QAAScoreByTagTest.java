package net.savantly.sprout.franchise.domain.operations.qai.score;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class QAAScoreByTagTest {
    @Test
    void test() {
        QAAScoreByTag score = new QAAScoreByTag();

        int availablePoints = 100;
        score.addAvailablePoints(availablePoints);

        int naPoints = 10;
        score.addNaPoints(naPoints);

        int scoredPoints = 90;
        score.addScorePoints(scoredPoints);

        String expected = "1.00";
        Assertions.assertEquals(expected, score.getRating().toString());
    }

    @Test
    void test0() {
        QAAScoreByTag score = new QAAScoreByTag();

        int availablePoints = 10;
        score.addAvailablePoints(availablePoints);

        int naPoints = 10;
        score.addNaPoints(naPoints);

        int scoredPoints = 0;
        score.addScorePoints(scoredPoints);

        String expected = "0";
        Assertions.assertEquals(expected, score.getRating().toString());
    }
}
