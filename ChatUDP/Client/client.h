#pragma once
#include "socket_wrapper.h"
#include "message.h"

#include <string>
#include <mutex>
#include <vector>

class Client
{
public:
  Client(int port, std::string name, int another_client_port);
  

  void send_int(int number);
  int recv_int();
  void send_message(const Message& message);

private:
  bool recv_message();
  void get_new_messages();


private:
  SocketWrapper _sock;
  std::string _name;
  int _another_client_port;
  mutable std::mutex _new_messages_mutex;
  std::vector<Message> _new_messages;
};

