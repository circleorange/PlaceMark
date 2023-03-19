import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { categoryController } from "./controllers/category-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "GET", path: "/about", config: aboutController.index },
  { method: "POST", path: "/dashboard/add-category", config: dashboardController.addCategory },

  { method: "GET", path: "/category/{id}", config: categoryController.index },
  { method: "POST", path: "/category/{id}/add-poi", config: categoryController.addPoi },
  { method: "GET", path: "/dashboard/delete-category/{id}", config: dashboardController.deleteCategory },
  { method: "GET", path: "/category/{id}/delete-poi/{poiId}", config: categoryController.deletePoi },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
  { method: "POST", path: "/category/{id}/upload-image", config: categoryController.uploadImage },
];
