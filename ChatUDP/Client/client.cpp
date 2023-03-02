#include "client.h"

#include <utility>
#include <iostream>
#include <thread>
#include <sstream>
using namespace std;

Client::Client(int port, std::string name, int another_client_port) :
  _sock("127.0.0.1", port), _name(move(name)), _another_client_port(another_client_port)
{
  _sock.start(); 

  thread requestMessagesThread([this]() {
    get_new_messages();
    });
  requestMessagesThread.detach();
}

void Client::send_int(int number)
{
  _sock.send_to(_another_client_port, reinterpret_cast<const char*>(&number), sizeof(number));
}

int Client::recv_int()
{
  int number;
  if(_sock.recv_from(reinterpret_cast<char*>(&number), sizeof(number)))
    return number;
  return 0;
}

void Client::send_message(const Message& message)
{
  stringstream ss;
  ss << message.from << '\n' << message.to << '\n' << message.body;
  string str = ss.str();
  _sock.send_to(_another_client_port, str.c_str(), str.size());
}

bool Client::recv_message()
{
  constexpr int BUF_SIZE = 1024;
  char buf[BUF_SIZE] = { 0 };
  if (!_sock.recv_from(buf, BUF_SIZE))
    return false;

  stringstream ss(buf);
  Message message;
  cout << message << endl;

  return true;
}

void Client::get_new_messages()
{
  // lock_guard g(_sock_mutex);
  while (true)
  {
    Sleep(100);
    try
    {
      recv_message();
    }
    catch (const std::exception&)
    {
      return; // Если сокет закрылся, то выкидывается исключение.
    }
  }
}
