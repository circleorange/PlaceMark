import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, testUsers } from "../fixtures.js";

const users = new Array(testUsers.length);

suite("User API Tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[0] = await placemarkService.createUser(testUsers[i]);
    }
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
  });
  teardown(async () => {});
  test("Create new user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });
  test("Get user", async () => {
    const returnedUser = await placemarkService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });
  test("Delete all users", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
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
    await placemarkService.authenticate(maggieCredentials);
    try {
      const returnedUser = await placemarkService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "User ID not found");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});