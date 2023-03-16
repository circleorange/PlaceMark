import { userMemStore } from "./mem/user-mem-store.js";
import { playlistMemStore } from "./mem/category-mem-store.js";

export const db = {
  userStore: null,
  playlistStore: null,

  init() {
    this.userStore = userMemStore;
    this.playlistStore = playlistMemStore;
  },
};
