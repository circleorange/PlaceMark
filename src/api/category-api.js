import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const categoryApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const categories = await db.categoryStore.getAllCategories();
        return categories;
      } catch (err) { return Boom.serverUnavailable("Database Error"); }
    },
  },
  findOne: {
    auth: { strategy: "jwt" },
    async handler(request) {
      try {
        // console.log("api.category.fineOne.request.params", request.params);
        const category = await db.categoryStore.getCategoryById(request.params.id);
        if (!category) {
          return Boom.notFound("No Category with this id");
        }
        // console.log("api.category.fineOne.response", category);
        return category;
      } catch (err) { return Boom.serverUnavailable("No Category with this id"); }
    },
  },
  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const category = request.payload;
        // console.log("api.category.create.payload", category);
        const newCategory = await db.categoryStore.addCategory(category);
        if (newCategory) {
          // console.log("api.category.create.response", newCategory);
          return h.response(newCategory).code(201);
        }
        return Boom.badImplementation("error creating category");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        if (!category) {
          return Boom.notFound("No Category with this id");
        }
        await db.categoryStore.deleteCategoryById(category._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Category with this id");
      }
    },
  },
  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.categoryStore.deleteAllCategories();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  getByUser: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const response = await db.categoryStore.getUserCategories(request.params.id);
        // console.log("api.category.getByUser.response", response);
        return response;
      } catch (error) {
        return [];
      }
    }
  },
};