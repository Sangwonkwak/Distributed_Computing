package rdate;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.Date;
import java.util.Locale;
  
public interface RemoteDate extends Remote{
	//Server machine�� �ð� return
	Date remoteDate() throws RemoteException;
	//Locale�� �µ��� server machine�� �ð��� ��ȯ�Ͽ� string���� ��ȯ
	String regionalDate(Locale language) throws RemoteException;
}

