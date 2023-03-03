#pragma once
#include <WinSock2.h>
#include <string>


class SocketWrapper
{
public:
  SocketWrapper(std::string host_name, int port);
  ~SocketWrapper();

  void start();
  bool recv_from(char* buf, int len) const;
  void send_to(int other_port, const char* buf, int len) const;


private:
  void init_winsock_dll() const;
  void fill_addr_in();
  void init_sock();
  void fill_addr_in_other();

private:
  std::string _host_name; // TODO: Проверить надо ли это вообще.
  int _port;
  std::string _address; // TODO: Проверить надо ли это вообще.
  SOCKADDR_IN _addr_in;
  size_t _addr_in_size;
  SOCKET _sock;
  mutable SOCKADDR_IN _addr_in_other;
  mutable int _addr_in_other_size;
};

