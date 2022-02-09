package net.savantly.sprout.franchise.domain.locationOpenDateInterval;

import static org.mockito.Mockito.mock;

import java.time.LocalDate;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class LocationOpenDateIntervalConverterTest {

    
    @Test
    void TestConversion() {
        
		LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(10);
		LocationOpenDateIntervalDto dto = new LocationOpenDateIntervalDto().setStart(startDate).setEnd(endDate);

        LocationOpenDateIntervalRepository repo = mock(LocationOpenDateIntervalRepository.class);
        LocationOpenDateIntervalConverter converter = new LocationOpenDateIntervalConverter(repo);

        LocationOpenDateInterval entity = converter.toEntity(dto).orElseThrow(() -> new RuntimeException("failed to convert dto to entity"));
        LocationOpenDateIntervalDto actual = converter.toDto(entity).orElseThrow(() -> new RuntimeException("failed to convert entity to dto"));

        Assertions.assertEquals(dto.getStart(), actual.getStart());
        Assertions.assertEquals(dto.getEnd(), actual.getEnd());
    }
}
