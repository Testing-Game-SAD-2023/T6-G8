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


