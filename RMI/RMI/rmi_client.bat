set HOST_NAME=%1
set CURPATH=%cd%

cd src
java -Djava.security.policy=policy\client.policy client/RdateClient %HOST_NAME%

cd %CURPATH%