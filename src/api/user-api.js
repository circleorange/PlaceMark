import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";
import { UserSpec, UserSpecPlus, UserCredentialsSpec, IdSpec, UserArraySpec, JwtAuth } from "../models/joi-schemas.js";
import { createToken } from "./jwt-utils.js";

const saltRounds = 10;

export const userApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) { return Boom.serverUnavailable("Database Error"); }
    },
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
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = request.payload;
        user.password = await bcrypt.hash(user.password, saltRounds);
        await db.userStore.addUser(request.payload);
        console.log("api.user.create.payload", user);
        if (user) { return h.response(user).code(201); }
        return Boom.badImplementation("Error creating user");
      } catch (err) {return Boom.serverUnavailable("Database Error"); }
    },
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
  },
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        const user = await db.userStore.getUserByEmail(email);
        if (!user) { return Boom.unauthorized("User not found"); }
        console.log("api.user.authenticate.getUserByEmail", user);
        const passwordsMatch = await bcrypt.compare(password, user.password);
        console.log(`Password entered by user: ${password}`);
        console.log(`Account password: ${user.password}`);
        console.log(`Do passwords match: ${passwordsMatch}`);
        if (!passwordsMatch) { return Boom.unauthorized("Invalid password"); }
        const token = createToken(user);
        return h.response({ success: true, token: token, _id: user._id }).code(201);
      } catch (err) { return Boom.serverUnavailable("Database Error", err); }
    },
  },
};