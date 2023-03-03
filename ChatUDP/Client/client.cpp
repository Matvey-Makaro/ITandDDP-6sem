#include "client.h"

#include <utility>
#include <iostream>
#include <thread>
#include <sstream>
using namespace std;

Client::Client(int port, std::string name, int another_client_port) :
  _sock("127.0.0.1", port), 
  _name(move(name)), 
  _another_client_port(another_client_port)
{
  _sock.start(); 

  thread request_messages_thread([this]() {
    get_new_messages();
    });
  request_messages_thread.detach();
  _request_messages_thread_handle = request_messages_thread.native_handle();
}

Client::~Client()
{
  TerminateThread(_request_messages_thread_handle, 0);
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

void Client::send_message(string body)
{
  stringstream ss;
  ss << _name << '\n' << body;
  string str = ss.str();
  _sock.send_to(_another_client_port, str.c_str(), static_cast<int>(str.size()));

  {
    lock_guard g(_new_messages_mutex);
    _new_messages.push_back(Message{ _name, move(body) });
  }
}

const Messages& Client::get_new_msgs() const
{
  return _new_messages;
}

bool Client::recv_message()
{
  constexpr int BUF_SIZE = 1024;
  char buf[BUF_SIZE] = { 0 };
  if (!_sock.recv_from(buf, BUF_SIZE))
    return false;

  stringstream ss(buf);
  Message message;
  ss >> message;
  {
    lock_guard g(_new_messages_mutex);
    _new_messages.push_back(move(message));
  }

  return true;
}

void Client::get_new_messages()
{
  while (true)
  {
    Sleep(100);
    try
    {
      if(recv_message())
      {
        lock_guard g(_new_messages_mutex);
        cout << _new_messages.back() << endl;
      }
    }
    catch (const std::exception&)
    {

    }
  }
}
