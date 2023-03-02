#include "server.h"

Server::Server() :
  _sock("127.0.0.1", 8888)
{ }

Server::~Server()
{
  // TODO: Очиститить тут то, что нужно.
}