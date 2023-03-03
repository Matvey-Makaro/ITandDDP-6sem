#pragma once

#include <iostream>
#include <string>
#include <vector>

struct Message
{
  std::string from;
  std::string body;
};

using Messages = std::vector<Message>;

std::ostream& operator<<(std::ostream& out, const Message& message);
std::istream& operator>>(std::istream& in, Message& message);

Messages read_messages(const std::string& fname);
void save_messages(const std::string& fname, const Messages& messages);
