# CodeRush  
- Compile and execute code.
- Switch themes from a list of available themes.
- Returns coverage of written code.
- Returns coverage results.

## Installations and setup without Docker
- git clone `https://github.com/Testing-Game-SAD-2023/T6-G8`
- download node.js: `https://nodejs.org/en/download`
- in 'Node.js command prompt': `npm install`
- `path project`
- `folder "codice"`
	- `folder "editor"`
		- `npm start` to run the frontend
	- `folder "EditorApp"`
		- `folder "target"`
			- `java -jar EditorApp-0.0.1-SNAPSHOT.jar` to run the backend

If you wanto to try the application with three simulated servers:
- `folder "server"`
- `node ClassServer.js` to run the server of the test classes
- `node CoverageServer.js` to run the server of the coverage
- `node TestsServer.js` to run the server of the test saved


