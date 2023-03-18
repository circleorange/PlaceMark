import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, beaches, testCategories } from "../fixtures.js";
import { db } from "../../src/models/db.js";

EventEmitter.setMaxListeners(25);

suite("Category API tests", () => {
  let user = null;
  setup(async () => {
    db.init("json");
    await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    beaches.userid = user._id;
  });
  teardown(async () => {});
  test("Create category", async () => {
    const returnedCategory = await placemarkService.createCategory(beaches);
    assert.isNotNull(returnedCategory);
    assertSubset(beaches, returnedCategory);
  });
  test("Delete category", async () => {
    const category = await placemarkService.createCategory(beaches);
    const response = await placemarkService.deleteCategory(category._id);
    assert.equal(response.status, 204);
    try {
      const returnedCategory = await placemarkService.getCategory(category.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id", "Incorrect Response Message");
    }
  });
  test("Create multiple categories", async () => {
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createCategory(testCategories[i]);
    }
    let returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    await placemarkService.deleteAllCategories();
    returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, 0);
  });
  test("Delete invalid category - Failure", async () => {
    try {
      const response = await placemarkService.deleteCategory("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id", "Incorrect Response Message");
    }
  });
});