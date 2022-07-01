# Development 

These steps have only been tested on Mac/Linux/WSL2.  

The Franchise-Manager module for the Sprout Platform is packaged as a jar, and contains backend and frontend code.  

## Requirements
- *nix shell environment.  
- docker
- docker-compose
- yarn [recommended for continuous UI build]

## Start the dev environment

A script is provided to build and start the required service [DB, WebApp].  
Docker compose is leveraged to start the services.
Spring Boot dev tools allows us to develop while the app is running, and see the changes without manually restarting the server.  

Postgres Adminer is also included, should you want to inspect the DB.  

It make several minutes to build and run the project the first time.  

Sprout UI should be running at [localhost:3000](http://localhost:3000)  
Sprout API should be running at [localhost:8080](http://localhost:8080)  
Adminer should be running at [localhost:8081](http://localhost:8081)  

### With Make

```
make dev
```

### Without Make

```
./scripts/dev.sh
```

In another terminal, start the backend server -  
```
./gradlew bootRun
```

### Config
If you need to expose the services on different ports on your host system, you may export some variables before running `./scripts/dev.sh`  
Available env vars and their defaults -  
|Env Var|Default|Description|
|--|--|--|
|WEB_PORT|3000|The port to expose the website on|
|DB_PORT|5432|The port to expose the DB on|
|ADMINER_PORT|8081|The port to expose DB Adminer on|
|SPROUT_API_URL|http://docker.host.internal:8080|The url the backend server is exposed on.|

Example -  
```
export WEB_PORT=3001
./scripts/dev.sh
```

The UI will now be exposed on port 3001 on the host system. This does not effect the port that the container is exposing inside the docker network.  
[http://localhost:3001](http://localhost:3001)  

You may also create a `.env` file in the root of the project, to have the script automatically source the variables.  

On some systems, you may need to modify the `SPROUT_API_URL` to use the docker host IP.  
You may find this using `ifconfig` or similar tool.


## Continuous UI development
When working on the UI, first start the dev environment using the previous instruction  
To modify the UI components, edit the files in [./module/src/plugin](../module/src/plugin)  
You may want to continuously build the plugin/front-end code.  
Open another terminal and run these commands while the development environment is running.  

```
cd module
yarn watch
```

This allows seamless development of the front-end code.  
When changes to the UI are saved, `yarn` automatically rebuilds them.  
Refresh the browser to see updates.  

## Testing
Execute the test script to perform all the tests -  
```
./scripts/test.sh
```

## Building
To build the module as a jar, execute the build script -  
```
./scripts/build.sh
```

