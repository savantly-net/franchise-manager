package net.savantly.sprout.franchise.domain.files;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Builder;
import net.savantly.sprout.domain.file.FileData;

@RestController
@RequestMapping("/api/fm/files")
@Builder
public class FMFilesApi {

	private final FileData rootFolder;
	private final FileData qaiFolder;

	@GetMapping("/config")
	public ResponseEntity<Map<String, Object>> getConfig() {
		HashMap<String, Object> payload = new HashMap<>();
		payload.put("rootFolder", rootFolder);
		payload.put("qaiFolder", qaiFolder);
		return ResponseEntity.ok(payload);
	}

}
