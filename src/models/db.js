import { userMemStore } from "./mem/user-mem-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js";
import { poiMemStore } from "./mem/poi-mem-store.js";

export const db = {
  userStore: null,
  categoryStore: null,
  poiStore: null,

  init() {
    this.userStore = userMemStore;
    this.categoryStore = categoryMemStore;
    this.poiStore = poiMemStore;
  },
};
