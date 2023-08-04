# Graphic-walker Service Demo


Here is a demo of the Graphic-walker server-side mode, to demonstrate how to integrate Graphic-walker and gw-dsl-parser capabilities. It shows how to transform Graphic-walker to SQL to run on compute engine.
## Quick Start

use docker compose to start the service


```bash
git submodule add --force git@github.com:Kanaries/graphic-walker.git packages/graphic-walker

docker-compose up --build
```

the frontend and backend services will run on ports 5173 and 23402 respectively.

you can go to http://localhost:5173/ and load data with datasetId = 1.


## Embed GraphicWalker

you can read the [gw_embed.md](doc/gw_embed.md) to learn how to embed GraphicWalker in your project.

## Custom Backend Service


As long as you follow the specifications to implement the backend HTTP interfaces, you can quickly integrate your own backend. about the backend API [custom_backend.md](doc/custom_backend.md)