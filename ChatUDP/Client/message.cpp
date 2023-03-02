#include "message.h"

std::ostream& operator<<(std::ostream& out, const Message& message)
{
  out << "From: " << message.from << '\n';
  out << "To: " << message.to << '\n';
  out << "Body: " << message.body;
  return out;
}

std::istream& operator>>(std::istream& in, Message& message)
{
  std::getline(in, message.from);
  std::getline(in, message.to);
  std::getline(in, message.body);
  return in;
}
