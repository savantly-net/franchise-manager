package net.savantly.sprout.franchise.domain.files;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.domain.file.FileData;
import net.savantly.sprout.domain.file.FileDataRequest;
import net.savantly.sprout.domain.file.FileProvider;

/**
 * 
 * @author jeremybranham
 *
 */
@Configuration
@RequiredArgsConstructor
public class FranchiseFilesConfiguration implements InitializingBean {

	private final FileProvider fileProvider;
	private final static String FM_FOLDER_NAME = "FM";
	private final static String FM_QAI_FOLDER_NAME = "QAI";

	private FileData rootFolder;
	private FileData qaiFolder;

	@Override
	public void afterPropertiesSet() throws Exception {
		ensureFoldersExists();
	}

	private void ensureFoldersExists() {

		rootFolder = ensureFolderExists(null, FM_FOLDER_NAME);
		qaiFolder = ensureFolderExists(rootFolder.getId(), FM_QAI_FOLDER_NAME);

	}

	private FileData ensureFolderExists(String path, String folderName) {
		return fileProvider.getFilesByFolder(path).getChildren().stream()
				.filter(f -> f.getName().contentEquals(folderName)).findFirst().orElseGet(() -> fileProvider
						.createFile(new FileDataRequest().setDir(true).setName(folderName).setParent(path)));
	}

	@Bean
	public FMFilesApi fmFilesApi() {
		return new FMFilesApi.FMFilesApiBuilder().rootFolder(rootFolder).qaiFolder(qaiFolder).build();
	}

}
