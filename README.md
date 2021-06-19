# Franchise Manager 
The franchise manager module provides basic line-of-business data management for managing franchises.  
It's developed as a Sprout Module to take advantage of the pluggable nature of Sprout.  
Both Sprout and Franchise Module are dependencies that can be added to a Java Spring Boot application, to facilitate extension, customization, and easy upgrades.  


## Quick start

### Example
[Example server](./example) using the Franchise Manager module.  
Run the docker compose to set the example environment.  

```
docker compose -f example/docker-compose.yml up
```

Access the front-end at [http://localhost:3000](http://localhost:3000) 
with the default user/pass `admin/changeme!`

Postgres Adminer is exposed at `localhost:8081`

To remove the containers -  

```
docker compose -f example/docker-compose.yml rm
```

To build the image - 
```
./gradlew :fm-example:bootBuildImage
```

### Module
The Franchise Manager module for the Sprout Platform.   
The module is packaged as a jar, and contains backend and frontend code.  

#### Development 
In one terminal start the Java dev continuous build.  

```

```

