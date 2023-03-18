import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, testUsers } from "../fixtures.js";

suite("User API Tests", () => {
  setup(async () => {
    await placemarkService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await placemarkService.createUser(testUsers[i]);
    }
  });
  teardown(async () => {});
  test("Create new user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });
  test("Delete all users", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await placemarkService.deleteAllUsers();
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });
  test("Get user - Success", async () => {
    const returnedUser = await placemarkService.getUser(testUsers[0]._id);
    assert.deepEqual(testUsers[0], returnedUser);
  });
  test("Get invalid user - Bad ID", async () => {
    try {
      const returnedUser = await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "User ID not found");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
  test("Get invalid user - Deleted user", async () => {
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    try {
      const returnedUser = await placemarkService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "User ID not found");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});