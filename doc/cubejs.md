

### How to connect to Cube

CubeJS itself provides the capability to simulate itself as a PG client and integrate with other BI software, so Graphic-Walker can certainly do so as well.

We have done some development in the branch : cube to make it easier for users to understand the integration process.

### Step
1. checkout the branch cube
```dockerfile
git clone 
git checkout cube
```

2. config  cube host  
    You need to modify the configuration in the envs.env file.
```dockerfile
CUBE_USER=cube
CUBE_PASSWORD=//password
CUBE_HOST=//host
CUBE_PORT=5432
CUBE_DB=magenta-wombat
```
> Regarding how to obtain it, you can refer to the documentation: https://cube.dev/docs/product/apis-integrations/sql-api

3. start the service
```dockerfile
docker-compose up --build
```

4. open the browser
```dockerfile
http://localhost:5173/
```

5. load data  
Use your CubeJS name to load data.