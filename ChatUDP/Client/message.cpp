#include "message.h"

#include <fstream>

std::ostream& operator<<(std::ostream& out, const Message& message)
{
  out << "From: " << message.from << '\n';
  out << "Body: " << message.body;
  return out;
}

std::istream& operator>>(std::istream& in, Message& message)
{
  std::getline(in, message.from);
  std::getline(in, message.body);
  return in;
}

Messages read_messages(const std::string& fname)
{
  Messages messages;

  std::ifstream ifs(fname);
  if (!ifs.is_open())
    return messages;

  Message msg;
  while (ifs >> msg)
    messages.push_back(std::move(msg));

  return messages;
}

void save_messages(const std::string& fname, const Messages& messages)
{
  std::ofstream ofs(fname, std::ios::app);
  if (!ofs.is_open())
    std::cerr << "File " << fname << " doesn't open!" << std::endl;

  for (const auto& msg : messages)
    ofs << msg.from << '\n' << msg.body << '\n';

  ofs.close();
}
