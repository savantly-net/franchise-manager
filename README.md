# Franchise Manager 
The franchise manager module provides basic line-of-business data management for managing franchises.  
It's developed as a Sprout Module to take advantage of the pluggable nature of Sprout.  
Both Sprout and Franchise Module are dependencies that can be added to a Java Spring Boot application, to facilitate extension, customization, and easy upgrades.  

Read more about the Sprout Project -  
[https://github.com/savantly-net/sprout-platform](https://github.com/savantly-net/sprout-platform)


## Quick start

## Demo 
Access a running [demo here](https://franhise-manager.herokuapp.com/)  
Login with -  
- username: admin
- password: changeme!

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

## Development 
### Module
The Franchise Manager module for the Sprout Platform.   
The module is packaged as a jar, and contains backend and frontend code.  

#### Note for WSL2
If developing in WSL2, you may need to set the SPROUT_API_URL to the WSL2 system IP for the routing between the web app and the backend API.  
For example, from the Linux shell get the IP address using `ifconfig`  
And export the variable [using the correct IP for your system] -  
```
export SPROUT_API_URL=http://172.23.0.25:8080
```

#### Start the development processes

Start the required service [DB, WebApp]
```
docker compose -f module/docker-compose.yml up
```

In another terminal, start the dev app -  
```
./gradlew :fm-module:bootRun
```

To continuously build the plugin/front-end code, open another terminal.  
This allows seamless development of the front-end code. Refresh the browser to see updates.  
```
cd module
yarn watch
```

If you're working on the Java code, in one terminal start the Java dev continuous build.  
```
./gradlew :fm-module:compileJava --continuous
```


Sprout UI should be running at [localhost:3000](http://localhost:3000)  
Sprout API should be running at [localhost:8080](http://localhost:8080)  
Adminer should be running at [localhost:8081](http://localhost:8081)  

To modify the UI components, edit the files in [./module/src/plugin](./module/src/plugin)

## Features

Home page showing the menu options added by the Franchise Manager module  
![Home](./docs/images/home.png)  

## Permissions  
New permissions available  
![Permissions](./docs/images/permissions.png)  

### Location Management

Manage franchise location information -  
Add attributes such as address, bars, patios, POS terminals, and others ...  

Locations List  
![location list](./docs/images/location_list.png)  

Location Edit   
![location edit](./docs/images/location_edit.png)  

### Franchise fee management  

Manage the fees associated with a franchise.  

Fee Types   
![location edit](./docs/images/fee_types.png)  

Fee Type Edit   
![location edit](./docs/images/fee_type_edit.png)  

### QAI 

Manage the QAI surveys and 'store visit' forms.  
Create multiple sections, question categories, questions, and associated points  
See the [QA Setup Guide](./docs/qa.md) for more information.  

QAI Question Category List
![qai category](./docs/images/qai_category_list.png)  

QAI Section Editor  
![qai section editor](./docs/images/qai_section_edit.png)  

QAI Section Data Entry  
![qai section editor](./docs/images/qai_section_data_entry.png)  
