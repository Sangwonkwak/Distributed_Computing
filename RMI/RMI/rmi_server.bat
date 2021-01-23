set CURPATH=%cd%
set HOST_NAME=%1

cd src
start rmiregistry -J-Djava.class.path=%cd% 1012
java -Djava.security.policy=policy\server.policy -Djava.rmi.server.codebase=file:%cd%\server\ -Djava.rmi.server.hostname=%HOST_NAME% server/RdateServer 
 
cd %CURPATH%