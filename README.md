# CodeRush  
- Compile and execute code.
- Switch themes from a list of available themes.
- Returns coverage of written code.
- Returns coverage results.

## Installations and setup without Docker
- git clone `https://github.com/Testing-Game-SAD-2023/T6-G8`
- download node.js: `https://nodejs.org/en/download`
- in 'Node.js command prompt': `npm install`
- `folder "codice"`
	- `folder "EditorApp"`
		- `folder "target"`
			- `java -jar EditorApp-0.0.1-SNAPSHOT.jar` to run the backend
	- `folder "editor"`
		- `npm start` to run the frontend

If you wanto to try the application with three simulated servers:
- `folder "codice"`
	- `folder "ClassServer"`
		- `node ClassServer.js` to run the server of the test classes
	- `folder "CoverageServer"`
		- `node CoverageServer.js` to run the server of the coverage
	- `folder "TestsServer"`
		- `node TestsServer.js` to run the server of the test saved


## Installations and setup with Docker
- git clone `https://github.com/Testing-Game-SAD-2023/T6-G8`
- download Docker Desktop: `https://www.docker.com/products/docker-desktop/`
- open `Docker Desktop`
- `folder "codice"`
	- `folder "editor"`
		- `docker build -t frontend .` to build the frontend image
		- `docker run -p 3000:3000 frontend` to run the frontend container
	- `folder "EditorApp"`
		- `docker build -t backend .` to build the backend image
		- `docker run -p 8080:8080 backend` to run the backend container
- open a Browser and connect to `http://localhost:3000`

If you wanto to try the application with three simulated servers:
- `folder "codice"`
	- `docker-compose up` to build and run all the containers

## ENV Variables
To make the application context-independent we used Env Variables to specify the 
path to other containers/servers that expose the APIs/services needed by our task.
Based on the configuration, and without using any service discovery technology, it's
possible to specify the path to the appropriate service containers during the Docker-container 
execution with the command
` docker run -e CLASS_SERVER_URL=http://my-class-server:3002/ image_name `
If accessing remotely, please refer to the following link to read the documentation
` https://app.swaggerhub.com/apis/ZAIRAABDELMAJID/EditorG8/1.0.0 `


## API Documentation
APIs have been documented using the springdoc-openapi java library to automate and 
standardize the documentation process. 
To access the documentation, simply run the backend server and navigate to 
 	  `http://localhost:8080/swagger-ui/index.html`

