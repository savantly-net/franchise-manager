# Uses the resources from the official sprout webapp docker image
# Copies in the Franchise-Manager built jar module
FROM savantly/sprout-webapp as webapp

FROM adoptopenjdk:11-jre-hotspot as builder
WORKDIR /build
COPY example/build/libs/fm-example.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM adoptopenjdk:11-jre-hotspot

RUN mkdir -p /sprout/other && mkdir -p /sprout/modules
RUN apt-get update && apt-get -y install nginx postgresql
COPY --from=webapp /var/www/ /var/www/
COPY --from=webapp /etc/nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template

RUN mkdir -p /db && chown postgres:postgres /db
ENV PGDATA=/db

WORKDIR /sprout
VOLUME ["/etc/sprout"]
COPY --from=builder build/dependencies/ ./
COPY --from=builder build/snapshot-dependencies/ ./
COPY --from=builder build/spring-boot-loader/ ./
COPY --from=builder build/application/ ./
COPY docker/start.sh start.sh


ENV SPROUT_PLUGINS_DIR "/sprout/plugins"
ENV SPROUT_OTHER_CLASSES "/sprout/other"
ENV PORT=3000
ENV SERVER_PORT=8080
ENV SPROUT_API_URL=http://localhost:8080

ENV SPRING_PROFILES_ACTIVE=default
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/postgres
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_DATASOURCE_DRIVER_CLASS=org.postgresql.Driver
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
ENV SPROUT_JPA_USE_EMBEDDED_DB=false

ENV START_POSTGRES=false

ENTRYPOINT ["./start.sh"]
