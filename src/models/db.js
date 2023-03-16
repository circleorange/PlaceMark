import { userMemStore } from "./mem/user-mem-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js";
import { poiMemStore } from "./mem/poi-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { categoryJsonStore } from "./json/category-json-store.js";
import { poiJsonStore } from "./json/poi-json-store.js";

export const db = {
  userStore: null,
  categoryStore: null,
  poiStore: null,

  init(storeType) {
    switch (storeType) {
      case "json":
        this.userStore = userJsonStore;
        this.categoryStore = categoryJsonStore;
        this.poiStore = poiJsonStore;
        break;
      default:
        this.userStore = userMemStore;
        this.categoryStore = categoryMemStore;
        this.poiStore = poiMemStore;
    }
  },
};
