// Non-persistent memory db
import { userMemStore } from "./mem/user-mem-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js";
import { poiMemStore } from "./mem/poi-mem-store.js";

// Persistent JSON db
import { userJsonStore } from "./json/user-json-store.js";
import { categoryJsonStore } from "./json/category-json-store.js";
import { poiJsonStore } from "./json/poi-json-store.js";

// Persistent Mongo db
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { poiMongoStore } from "./mongo/poi-mongo-store.js";

// Firebase Realtime database
import { connectFirebase } from "./firebase/connect.js";
import { userFirebaseStore } from "./firebase/accounts-firebase-store.js";
import { categoryFirebaseStore } from "./firebase/category-firebase-store.js";
import { poiFirebaseStore } from "./firebase/poi-firebase-store.js";

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
      case "mongo":
        this.userStore = userMongoStore;
        this.categoryStore = categoryMongoStore;
        this.poiStore = poiMongoStore;
        connectMongo();
        break;
      case "firebase":
        this.userStore = userFirebaseStore;
        this.categoryStore = categoryFirebaseStore;
        this.poiStore = poiFirebaseStore;
        connectFirebase();
        break;
      default:
        this.userStore = userMemStore;
        this.categoryStore = categoryMemStore;
        this.poiStore = poiMemStore;
    }
  },
};