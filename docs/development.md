# Development 

These steps have only been tested on Mac/Linux/WSL2.  

The Franchise-Manager module for the Sprout Platform is packaged as a jar, and contains backend and frontend code.  

## Requirements
- *nix shell environment.  
- docker
- docker-compose
- yarn [recommended for continuous UI build]

## Quickstart

A script is provided to build and start the required service [DB, WebApp].  
Docker compose is leveraged to start the services, and creates a container that mounts the project files at `/app` in the running container.  
This allows us to develop while the container is running, and see the changes without manually restarting the server.  

Postgres Adminer is also included, should you want to inspect the DB.  

```
./scripts/dev.sh
```

It make several minutes to build and run the project the first time.  

Sprout UI should be running at [localhost:3000](http://localhost:3000)  
Sprout API should be running at [localhost:8080](http://localhost:8080)  
Adminer should be running at [localhost:8081](http://localhost:8081)  

### Config
If you need to expose the services on different ports on your host system, you may export some variables before running `./scripts/dev.sh`  
Available env vars and their defaults -  
```
WEB_PORT=3000
DB_PORT=5432
ADMINER_PORT=8081
API_PORT=8080
```

Example -  
```
export WEB_PORT=3001
./scripts/dev.sh
```

The UI will now be exposed on port 3001 on the host system. This does not effect the port that the container is exposing inside the docker network.  
[http://localhost:3001](http://localhost:3001)  


## Continuous UI development
When working on the UI, first start the dev environment using `./scripts/dev.sh`  
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
