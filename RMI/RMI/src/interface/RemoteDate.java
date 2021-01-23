package rdate;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.Date;
import java.util.Locale;
  
public interface RemoteDate extends Remote{
	//Server machine의 시간 return
	Date remoteDate() throws RemoteException;
	//Locale에 맞도록 server machine의 시간을 변환하여 string으로 반환
	String regionalDate(Locale language) throws RemoteException;
}

