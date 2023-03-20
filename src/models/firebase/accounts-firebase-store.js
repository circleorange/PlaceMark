import { database } from "./connect.js";

export const userFirebaseStore = {
    async getAllUsers() {
      const users = [];
      const snapshot = await database.ref("users").once("value");
      snapshot.forEach((childSnapshot) => {
        users.push(childSnapshot.val());
      });
      return users;
    },
    async getUserById(id) {
      const snapshot = await database.ref(`users/${id}`).once("value");
      return snapshot.val();
    },
    async addUser(user) {
      const newUserRef = database.ref("users").push();
      await newUserRef.set(user);
      const snapshot = await newUserRef.once("value");
      return snapshot.val();
    },
    async getUserByEmail(email) {
      const snapshot = await database
        .ref("users")
        .orderByChild("email")
        .equalTo(email)
        .once("value");
      const user = snapshot.val();
      return user ? Object.values(user)[0] : null;
    },
    async deleteUserById(id) {
      await database.ref(`users/${id}`).remove();
    },
    async deleteAll() {
      await database.ref("users").remove();
    },
  };