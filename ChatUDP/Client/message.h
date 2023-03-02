#pragma once

#include <iostream>
#include <string>

struct Message
{
  std::string from;
  std::string to;
  std::string body;
};

std::ostream& operator<<(std::ostream& out, const Message& message);
std::istream& operator>>(std::istream& in, Message& message);
