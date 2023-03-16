import { v4 } from "uuid";

let categories = [];

export const categoryMemStore = {
  async getAllCategories() { return categories; },
  async getCategoryById(id) { return categories.find((category) => category._id === id); },
  async deleteAllCategories() { categories = []; },

  async addCategory(category) {
    category._id = v4();
    categories.push(category);
    return category;
  },

  async deleteCategoryById(id) {
    const index = categories.findIndex((category) => category._id === id);
    categories.splice(index, 1);
  },
};
