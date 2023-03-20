import { database } from "./connect.js";
import { poiFirebaseStore } from "./poi-firebase-store.js";

export const categoryFirebaseStore = {
    async addCategory(category) {
      const newCategoryRef = database.ref("categories").push();
      await newCategoryRef.set(category);
      const snapshot = await newCategoryRef.once("value");
      const newCategory = snapshot.val();
      newCategory.id = snapshot.key;
      return newCategory;
    },
    async getCategoryById(id) {
      const snapshot = await database.ref(`categories/${id}`).once("value");
      const category = snapshot.val();
      if (category) {
        category.id = snapshot.key;
        category.pois = await poiFirebaseStore.getPoisByCategoryId(category.id);
      }
      return category;
    },
    async getUserCategories(id) {
      const snapshot = await database
        .ref("categories")
        .orderByChild("userid")
        .equalTo(id)
        .once("value");
      const categories = [];
      snapshot.forEach((childSnapshot) => {
        const category = childSnapshot.val();
        category.id = childSnapshot.key;
        categories.push(category);
      });
      return categories;
    },
    async getAllCategories() {
      const categories = [];
      const snapshot = await database.ref("categories").once("value");
      snapshot.forEach((childSnapshot) => {
        const category = childSnapshot.val();
        category.id = childSnapshot.key;
        categories.push(category);
      });
      return categories;
    },
    async deleteCategoryById(id) {
      await database.ref(`categories/${id}`).remove();
    },
    async deleteAllCategories() {
      await database.ref("categories").remove();
    },
    async updateCategory(updatedCategory) {
      const categoryRef = database.ref(`categories/${updatedCategory.id}`);
      await categoryRef.update(updatedCategory);
    },
  };