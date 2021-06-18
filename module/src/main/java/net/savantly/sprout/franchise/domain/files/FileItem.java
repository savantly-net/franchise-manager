package net.savantly.sprout.franchise.domain.files;

import javax.persistence.Embeddable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class FileItem {

	private String id;
	private String name;
	private String downloadUrl;
	private String contentType;
	
}
