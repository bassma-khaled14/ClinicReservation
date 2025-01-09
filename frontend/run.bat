SET DOCKER_NETWORK=mynet3


:create_network
    docker network create %DOCKER_NETWORK%



:run_back
docker run -p 8000:3000 --name cont1 --network %DOCKER_NETWORK% bassma/back


:run_frontend
docker run -p 4000:3000  --name front_container2 --network %DOCKER_NETWORK% frontend

CALL :create_network

REM Run services
CALL :run_frontend
CALL :run_back

REM Provide information to the user
ECHO Services are starting. You can access:
ECHO - Node.js app at http://localhost:8000/
ECHO - Frontend app at http://localhost:4200/