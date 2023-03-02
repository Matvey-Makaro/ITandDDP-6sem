#pragma once

#include "socket_wrapper.h"

class Server
{
public:
  Server();
  ~Server();

  
private:
  SocketWrapper _sock;
};
