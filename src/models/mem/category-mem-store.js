import { v4 } from "uuid";
import { poiMemStore } from "./poi-mem-store.js";

let categories = [];

export const categoryMemStore = {
  async getAllCategories() { return categories; },
  async deleteAllCategories() { categories = []; },
  async getUserCategories(userid) { return categories.filter((category) => category.userid === userid); },
  async addCategory(category) {
    category._id = v4();
    categories.push(category);
    return category;
  },
  async deleteCategoryById(id) {
    const index = categories.findIndex((category) => category._id === id);
    categories.splice(index, 1);
  },
  async getCategoryById(id) {
    const list = categories.find((category) => category._id === id);
    list.pois = await poiMemStore.getPoisByCategoryId(list._id);
    return list;
  },
};
