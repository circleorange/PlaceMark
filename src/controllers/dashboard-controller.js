import { db } from "../models/db.js";
import { CategorySpec } from "../models/joi-schemas.js";

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
    validate: {
      payload: CategorySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Error creating category", errors: error.details }).takeover().code(400);
      },
    },
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
  },
  adminIndex: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const allCategories = await db.categoryStore.getAllCategories();
      const totalCategories = allCategories.length;
      const allPOI = await db.poiStore.getAllPois();
      const totalPOI = allPOI.length;
      const signedUpUsers = await db.userStore.getAllUsers();
      const viewData = {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        totalCategories: totalCategories,
        totalPOI: totalPOI,
        signedUpUsers: signedUpUsers,
      };
      return h.view("admin-dashboard-view", viewData);
    },
  },
  uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.poiStore.getPoiById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          placemark.img = url;
          await db.categoryStore.updateCategory(placemark);
        }
        return h.redirect(`/category/${category._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/category/${category._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
};
