import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";
import { UserSpec, UserSpecPlus, UserCredentialsSpec, IdSpec, UserArraySpec, JwtAuth } from "../models/joi-schemas.js";
import { createToken } from "./jwt-utils.js";

export const userApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) { return Boom.serverUnavailable("Database Error"); }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns details of all users",
    response: { schema: UserArraySpec, failAction: validationError },
  },
  findOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) { return Boom.notFound("User ID not found"); }
        return user;
      } catch (err) { return Boom.serverUnavailable("User ID not found"); }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) { return h.response(user).code(201); }
        return Boom.badImplementation("Error creating user");
      } catch (err) {return Boom.serverUnavailable("Database Error"); }
    },
    tags: ["api"],
    description: "Create new user",
    notes: "Return newly created user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },
  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "Deletes all users from PlaceMark",
  },
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) { return Boom.unauthorized("User not found"); }
        if (user.password !== request.payload.password) { return Boom.unauthorized("Invalid password"); }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) { return Boom.serverUnavailable("Database Error"); }
    },
    tags: ["api"],
    description: "Authenticate user",
    notes: "If user has valid email & password, create and return JWT token",
    validate: { payload: UserCredentialsSpec, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError },
  },
};