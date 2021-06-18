package net.savantly.sprout.franchise.domain;

import java.util.Optional;

/**
 * 
 * Convert a DTO to Entity or Entity to DTO
 * 
 * @author jeremybranham
 *
 * @param <D> DTO Type
 * @param <E> Entity Type
 */
public interface DtoConverter<D,E> {

	Optional<D> toDto(E from);
	Optional<E> toEntity(D from);
}
