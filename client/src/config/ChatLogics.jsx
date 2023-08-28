export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].username : users[0].username;
};

export const isDiffSender = (messages, m, i, userId) => {
  // console.log(m);
  if(!i)return m.sender._id !== userId;
  return (
    i && messages[i - 1].sender._id !== m.sender._id && m.sender._id !== userId
  );
};
