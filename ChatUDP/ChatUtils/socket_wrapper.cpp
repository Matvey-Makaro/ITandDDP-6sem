#include "pch.h"
#include "socket_wrapper.h"

#include <utility>
#include <exception>

#pragma comment(lib, "ws2_32.lib")

SocketWrapper::SocketWrapper(std::string host_name, int port) :
  _host_name(std::move(host_name)),
  _port(port),
  _address(_host_name + ':' + std::to_string(_port)),
  _addr_in{ 0 },
  _addr_in_size(sizeof(_addr_in)),
  _sock{ 0 }
{
}

SocketWrapper::~SocketWrapper()
{
  // TODO: Очистить то, что выделил
}

void SocketWrapper::start()
{
  init_winsock_dll();
  fill_addr_in();
  init_sock();
}

void SocketWrapper::init_winsock_dll() const
{
  WSAData wsaData;
  WORD DLLVersion = MAKEWORD(2, 1);
  if (WSAStartup(DLLVersion, &wsaData) != 0)
    throw std::runtime_error("WSAStartup failed!");
}

void SocketWrapper::fill_addr_in()
{
  _addr_in.sin_addr.s_addr = INADDR_ANY;
  _addr_in.sin_port = htons(_port);
  _addr_in.sin_family = AF_INET;
}

void SocketWrapper::init_sock()
{
  _sock = socket(AF_INET, SOCK_DGRAM, NULL);
  if (_sock == INVALID_SOCKET)
    throw std::runtime_error("Socket creation failed! " + std::to_string(WSAGetLastError()));

  if (bind(_sock, (SOCKADDR*)&_addr_in, static_cast<int>(_addr_in_size)) == SOCKET_ERROR)
    throw std::runtime_error("Bind failed! " + std::to_string(WSAGetLastError()));
}

