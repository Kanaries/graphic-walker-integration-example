# How to connect to Mysql

##  Config

Modify the MySQL related parameters in : /package/service/java/src/resources/application.properties:
```
spring.datasource.url=jdbc:mysql://ip:port/db
spring.datasource.username=user
spring.datasource.password=password
```
As well as the corresponding Kanaries-API-Key:
```
kanaries.key=ak-xxxxxx
```
Refer to this doc on how to get the API Key: ：https://github.com/Kanaries/pygwalker/wiki/How-to-get-api-key-of-kanaries%3F

> The demo project has temporarily added dependencies on Gson and OkHttp. These dependencies will be removed once the kanaries-dsl-parser-1.0-SNAPSHOT.jar is published to the Maven repository.
## Quick Start Demo

1. Start service
```dockerfile
docker-compose up --build
```

2. Open browser
```dockerfile
http://localhost:5173/
```

3. load data  
   Use your mysql table name to load data. enjoy the freedom of data analysis.
   <img width="1257" alt="image" src="https://github.com/Kanaries/graphic-walker-integration-example/assets/19528375/ec0702bb-de14-4cd3-a830-616def781982">



## Customize Server
Refer to: /doc/custom-server.md
