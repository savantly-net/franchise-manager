package example;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.context.WebApplicationContext;

import net.savantly.sprout.autoconfigure.SproutAutoConfiguration;
import test.AbstractContainerBaseTest;

@SpringBootTest
public class TestApplicationTest extends AbstractContainerBaseTest {

	@Autowired
	WebApplicationContext ctx;
	
	@Test
	public void smoke() {
		ctx.getBean(SproutAutoConfiguration.class);
	}
}
