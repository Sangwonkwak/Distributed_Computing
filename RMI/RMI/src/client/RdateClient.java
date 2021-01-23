package client;

import rdate.*;
import java.rmi.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.Locale;
import java.rmi.RMISecurityManager;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class RdateClient {
	public static void main(String args[]){
		// Set default hostname=localhost
		String host = (args.length < 1) ? "localhost" : args[0];
		System.setSecurityManager(new RMISecurityManager());
		InputStream in = System.in;
		InputStreamReader reader = new InputStreamReader(in);
		BufferedReader br = new BufferedReader(reader);
		
		try {
			Registry registry = LocateRegistry.getRegistry(host,1012);
			RemoteDate obj = (RemoteDate) registry.lookup("Rdata");
			
			int num;  
			System.out.println("Type a number, 1.Date type 2.Korean 3.English");
			num = Integer.parseInt(br.readLine());
			if(num == 1)
				System.out.println(obj.remoteDate().toString());
			else if(num == 2)
				System.out.println(obj.regionalDate(new Locale("ko")));
			else if(num == 3)
				System.out.println(obj.regionalDate(new Locale("en")));
		}
		catch(RemoteException e) {
			System.out.println(e.getMessage());
		}
		catch(Exception e) {
			System.out.println("RdateClient: "+e.getMessage());
		}
	}
}
