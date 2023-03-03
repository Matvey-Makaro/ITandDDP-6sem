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
  ~Client();
  
  void send_message(std::string body);
  const Messages& get_new_msgs() const;

private:
  bool recv_message();
  void get_new_messages();

private:
  SocketWrapper _sock;
  std::string _name;
  int _another_client_port;
  mutable std::mutex _new_messages_mutex;
  Messages _new_messages;
  HANDLE  _request_messages_thread_handle;
};

