#include "socket_wrapper.h"

#include <utility>
#include <exception>
#include <stdexcept>

#pragma comment(lib, "ws2_32.lib")
#pragma warning(disable : 4996)

SocketWrapper::SocketWrapper(std::string host_name, int port) :
  _host_name(std::move(host_name)),
  _port(port),
  _addr_in_size(sizeof(_addr_in)),
  _sock{ 0 },
  _addr_in_other_size(sizeof(_addr_in_other))
{
}

SocketWrapper::~SocketWrapper()
{
  closesocket(_sock);
  WSACleanup();
}

void SocketWrapper::start()
{
  init_winsock_dll();
  fill_addr_in();
  init_sock();
  off_block_recv();
  fill_addr_in_other();
}

bool SocketWrapper::recv_from(char* buf, int len) const
{
  auto recvResult = recvfrom(_sock, buf, len, 0, reinterpret_cast<sockaddr*>(&_addr_in_other), &_addr_in_other_size);
  if (recvResult == SOCKET_ERROR)
  {
    if (WSAGetLastError() != WSAEWOULDBLOCK)
      throw std::runtime_error("Recv error: " + std::to_string(WSAGetLastError()));
    return false;
  }
  return true;
}

void SocketWrapper::send_to(int other_port, const char* buf, int len) const
{
  _addr_in_other.sin_port = htons(other_port);
  _addr_in_other_size = sizeof(_addr_in_other);
  auto sendResult = sendto(_sock, buf, len, 0, reinterpret_cast<sockaddr*>(&_addr_in_other), _addr_in_other_size);
  if (sendResult == SOCKET_ERROR)
    throw std::runtime_error("Send error: " + std::to_string(WSAGetLastError()));
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
  _addr_in.sin_addr.s_addr = inet_addr(_host_name.c_str());
  _addr_in.sin_port = htons(_port);
  _addr_in.sin_family = AF_INET;
}

void SocketWrapper::init_sock()
{
  _sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
  if (_sock == INVALID_SOCKET)
    throw std::runtime_error("Socket creation failed! " + std::to_string(WSAGetLastError()));

  if (bind(_sock, (SOCKADDR*)&_addr_in, static_cast<int>(_addr_in_size)) == SOCKET_ERROR)
    throw std::runtime_error("Bind failed! " + std::to_string(WSAGetLastError()));
}

void SocketWrapper::fill_addr_in_other()
{
  _addr_in_other.sin_addr.s_addr = inet_addr(_host_name.c_str());
  _addr_in_other.sin_family = AF_INET;
}

void SocketWrapper::off_block_recv()
{
  BOOL l = TRUE;
  if (ioctlsocket(_sock, FIONBIO, (unsigned long*)&l) == SOCKET_ERROR)
    throw std::runtime_error("ioctlsocket error: " + std::to_string(WSAGetLastError()));
}
