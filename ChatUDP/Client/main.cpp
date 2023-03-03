#include "client.h"
#include "message.h"

#include <iostream>
#include <utility>
using namespace std;

int main()
{
	int client_port = 0, another_client_port = 0;
	string client_name;
	cout << "Enter your port: ";
	cin >> client_port;
	if (cin.fail())
	{
		cerr << "Incorrect input. Try again." << endl;
		return -1;
	}

	cout << "Enter another client port: ";
	cin >> another_client_port;
	if (cin.fail())
	{
		cerr << "Incorrect input. Try again." << endl;
		return -1;
	}

	cout << "Enter your name: ";
	cin >> client_name;

	string fname = client_name + ".msg";
	auto messages = read_messages(fname);

	for (const auto& msg : messages)
		cout << msg << '\n';

	try
	{
		Client client(client_port, move(client_name), another_client_port);
		cin.ignore(SHRT_MAX, '\n');
		while (true)
		{
			cout << "Enter your message: \n";
			string message;
			getline(cin, message);

			if (message == "/q")
				break;

			client.send_message(move(message));
		}

		save_messages(fname, client.get_new_msgs());
	}
	catch (const std::exception& ex)
	{
		cerr << ex.what() << endl;
	}


	system("pause");

	return 0;
}