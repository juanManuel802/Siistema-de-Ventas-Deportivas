export type User = {
  id: string;
  username: string;
  password: string;
};

export const USERS: User[] = [
  { id: "user1", username: "user1", password: "pass1" },
  { id: "user2", username: "user2", password: "pass2" },
  { id: "user3", username: "user3", password: "pass3" },
  { id: "user4", username: "user4", password: "pass4" },
];
