#include "client.h"

#include <iostream>
#include <utility>
using namespace std;

int main()
{
	int client_port = 0, another_client_port = 0;
	string client_name;
#if 1
	cout << "Enter your port: ";
	cin >> client_port;
	cout << "Enter another client port: ";
	cin >> another_client_port;
	cout << "Enter your name: ";
	cin >> client_name;
#else
	client_port = 8888;
	another_client_port = 8889;
	client_name = "Client";
#endif
	int number = 10;
	try
	{
		Client client(client_port, move(client_name), another_client_port);
		Message message = { "Sasha", "Maxim", "Hello!" };
		int answer = 1;
		while (answer)
		{
			cout << "Send? ";
			cin >> answer;
			if (answer)
				client.send_message(message);
		}
	}
	catch (const std::exception& ex)
	{
		cerr << ex.what() << endl;
	}

	cout << WSAGetLastError() << endl;

	system("pause");

	return 0;
}