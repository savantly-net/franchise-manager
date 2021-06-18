package net.savantly.sprout.franchise.domain.calendar;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.savantly.sprout.core.tenancy.TenantKeyedRepository;
import net.savantly.sprout.rest.crud.TenantedDtoController;

@RestController
@RequestMapping("/api/fm/calendar")
public class CalendarApi extends TenantedDtoController<CalendarItem, CalendarItem>{

	public CalendarApi(TenantKeyedRepository<CalendarItem> repository) {
		super(repository);
	}

	@Override
	protected CalendarItem convert(CalendarItem object) {
		return object;
	}

	@Override
	protected CalendarItem createEntity(CalendarItem object) {
		return object;
	}

	@Override
	protected CalendarItem updateEntity(CalendarItem entity, CalendarItem object) {
		return object;
	}

}
