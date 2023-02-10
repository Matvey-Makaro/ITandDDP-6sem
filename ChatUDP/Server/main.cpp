#include "socket_wrapper.h"

#include <iostream>
using namespace std;

int main()
{
  SocketWrapper sock("127.0.0.1", 8888);
	try
	{
		sock.start();
	}
	catch (const std::exception& ex)
	{
		cerr << ex.what() << endl;
	}
  
  return 0;
}