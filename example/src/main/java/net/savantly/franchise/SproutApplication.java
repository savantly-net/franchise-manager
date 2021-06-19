package net.savantly.franchise;

import java.util.Arrays;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.swagger.v3.oas.models.OpenAPI;

@SpringBootApplication(scanBasePackages = "net.savantly.franchise")
@EnableJpaRepositories({"net.savantly.franchise"})
@EntityScan({"net.savantly.franchise"})
@EnableScheduling
public class SproutApplication {
	
	private static final Logger log = LoggerFactory.getLogger(SproutApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(SproutApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
		return args -> {

			log.trace("Let's inspect all the beans:");

			String[] beanNames = ctx.getBeanDefinitionNames();
			Arrays.sort(beanNames);
			for (String beanName : beanNames) {
				log.trace(beanName);
			}

		};
	}
	
	@Bean
	OpenApiCustomiser openApiCustomizer() {
		return new OpenApiCustomiser() {
			
			@Override
			public void customise(OpenAPI openApi) {
				openApi.getInfo()
					.description("API Documentation")
					.title("Application API")
					.version(String.format("2.0.0-%s", DateTime.now().getMillis()));
			}
		};
	}
	
}
