package server;

import java.rmi.*;
import java.rmi.server.UnicastRemoteObject;
import rdate.*;
import java.util.Date;
import java.util.Locale;
import java.text.SimpleDateFormat;
import java.text.DateFormatSymbols;
import java.util.Calendar;

import java.rmi.registry.Registry;
import java.rmi.registry.LocateRegistry;

public class RdateServer implements RemoteDate{
	public RdateServer() throws RemoteException{}
	// RemoteDate implementation
	public Date remoteDate() throws RemoteException{
		Date time = new Date();
		return time;
	}
	
	public String regionalDate(Locale language) throws RemoteException{
		String lang = language.getLanguage();
		String result = "";
		if(lang == "ko") {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy년 MM월 dd일 HH시mm분ss초");
			Date d = new Date();
			result = "현재 시각: " + sdf.format(d);		
		}
		else if(lang == "en") {
			Calendar cal = Calendar.getInstance();  
			int yyyy = cal.get(Calendar.YEAR);
			int month = cal.get(Calendar.MONTH)+1;
			int dd = cal.get(Calendar.DAY_OF_MONTH);
			int HH = cal.get(Calendar.HOUR_OF_DAY);
			int mm = cal.get(Calendar.MINUTE);
			int ss = cal.get(Calendar.SECOND);
			String MM = new DateFormatSymbols(language).getMonths()[month-1];
			
			result = "Current time: "+MM+" "+dd+", "+yyyy+" "+HH+":"+mm+":"+ss;
		}
		else
			result = "Not valid language!";	
		return result;
	}
	// Bind 
	public static void main(String args[]) {
		
		if(System.getSecurityManager() == null) {
			System.setSecurityManager(new RMISecurityManager());
		}
		try {
			RdateServer obj = new RdateServer();
			// Register remote_obj to port# 1011
			RemoteDate stub = (RemoteDate) UnicastRemoteObject.exportObject(obj,1011);
			// Register rmiregistry to port# 1012
			Registry registry = LocateRegistry.getRegistry(1012);
			registry.bind("Rdata", stub);
			System.out.println("Rdata created and server ready");
		}
		catch(Exception e) {
			System.out.println("RdateServer "+e.getMessage());
		}
	}
}
