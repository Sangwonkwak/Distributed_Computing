set CURPATH=%cd%

cd src
javac -cp . interface\RemoteDate.java
javac -cp . server\RdateServer.java
javac -cp . client\RdateClient.java

cd %CURPATH%