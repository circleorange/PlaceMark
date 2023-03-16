import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const categories = await db.categoryStore.getUserCategories(loggedInUser._id);
      const viewData = {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        categories: categories,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addCategory: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newCategory = {
        userid: loggedInUser._id,
        type: request.payload.type,
      };
      await db.categoryStore.addCategory(newCategory);
      return h.redirect("/dashboard");
    },
  },

  deleteCategory: {
    handler: async function(request, h) {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        await db.categoryStore.deleteCategoryById(category._id);
        return h.redirect("/dashboard");
      },
  }
};
