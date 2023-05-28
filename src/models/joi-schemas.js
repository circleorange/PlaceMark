import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("Valid ID");

// ----- USER SCHEMA -----
export const UserCredentialsSpec = Joi.object().keys({
    email: Joi.string().email().example("homer@simpson.com").required().min(3).max(256),
    password: Joi.string().example("secret").required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,}$/),
  })
  .label("UserCredentials");
export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required().regex(/^[A-Za-z][A-Za-z' ]+$/),
  lastName: Joi.string().example("O'Simpson").required().regex(/^[A-Za-z][A-Za-z' ]+$/),
}).label("UserDetails");
export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");
export const UserArraySpec = Joi.array().items(UserSpecPlus).label("UserArray");

// ----- POINT OF INTEREST (POI) SCHEMA -----
export const PoiSpec = Joi.object()
  .keys({
    name: Joi.string().required().example("Silverstrand beach"),
    description: Joi.string().required().example("Amazing beach and such a beautiful landscape"),
    latitude: Joi.number().allow("").optional().example(53.2515).min(-90).max(90),
    longitude: Joi.number().allow("").optional().example(-9.1263).min(-180).max(180),
    categoryid: IdSpec,
  __v: Joi.number(),
  })
  .label("Poi");
export const PoiSpecPlus = PoiSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PoiPlus");
export const PoiArraySpec = Joi.array().items(PoiSpecPlus).label("PoiArray");

// ----- CATEGORY SCHEMA -----
export const CategorySpec = Joi.object()
  .keys({
    type: Joi.string().required().example("Beaches"),
    userid: IdSpec,
    pois: PoiArraySpec,
  })
  .label("Category");
export const CategorySpecPlus = CategorySpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CategoryPlus");
export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");

// ----- AUTHENTICATION -----
export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");