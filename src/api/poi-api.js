import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const poiApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const pois = await db.poiStore.getAllPois();
        return pois;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  findOne: {
    auth: false,
    async handler(request) {
      try {
        const poi = await db.poiStore.getPoiById(request.params.id);
        if (!poi) {
          return Boom.notFound("No poi with this id");
        }
        return poi;
      } catch (err) {
        return Boom.serverUnavailable("No poi with this id");
      }
    },
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.addPoi(request.params.id, request.payload);
        if (poi) {
          return h.response(poi).code(201);
        }
        return Boom.badImplementation("error creating poi");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.poiStore.deleteAllPois();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.getPoiById(request.params.id);
        if (!poi) {
          return Boom.notFound("No Poi with this id");
        }
        await db.poiStore.deletePoi(poi._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Poi with this id");
      }
    },
  },
};