import { assert } from "chai";
import { EventEmitter } from "events"; // Suppress console messages about memory leaks
import { db } from "../../src/models/db.js";
import { testCategories, beaches } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category Model Tests", () => {
  setup(async () => {
    db.init("json");
    await db.categoryStore.deleteAllCategories();
    for (let i = 0; i < testCategories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCategories[i] = await db.categoryStore.addCategory(testCategories[i]);
    }
  });
  test("Create category", async () => {
    EventEmitter.setMaxListeners(25);
    const category = await db.categoryStore.addCategory(beaches);
    assertSubset(beaches, category);
    assert.isDefined(category._id);
  });
  test("Delete all categories", async () => {
    let returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 3);
    await db.categoryStore.deleteAllCategories();
    returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });
  test("Get category - Success", async () => {
    const category = await db.categoryStore.addCategory(beaches);
    const returnedCategory = await db.categoryStore.getCategoryById(category._id);
    assertSubset(beaches, category);
  });
  test("Delete category - Success", async () => {
    const id = testCategories[0]._id;
    await db.categoryStore.deleteCategoryById(id);
    const returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, testCategories.length - 1);
    const deletedCategory = await db.categoryStore.getCategoryById(id);
    assert.isNull(deletedCategory);
  });
  test("Get invalid category - Bad Params", async () => {
    assert.isNull(await db.categoryStore.getCategoryById(""));
    assert.isNull(await db.categoryStore.getCategoryById());
  });
  test("Delete invalid category - Fail", async () => {
    await db.categoryStore.deleteCategoryById("bad-id");
    const allCategories = await db.categoryStore.getAllCategories();
    assert.equal(testCategories.length, allCategories.length);
  });
})