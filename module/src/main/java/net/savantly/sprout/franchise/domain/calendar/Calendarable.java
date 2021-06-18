package net.savantly.sprout.franchise.domain.calendar;

import java.time.ZonedDateTime;

public interface Calendarable<T> {

	ZonedDateTime getFromDate();
	ZonedDateTime getToDate();
	String getTitle();
	boolean isAllDay();
	T getResource();
}
