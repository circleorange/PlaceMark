import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCredentials } from "../fixtures.js";
import { db } from "../../src/models/db.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    db.init("json");
    await placemarkService.clearAuth();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllUsers();
  });
  test("Authenticate user", async () => {
    const returnedUser = await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggieCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });
  test("Verify token", async () => {
    const returnedUser = await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggieCredentials);
    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
  test("Unauthorized access - Failure", async () => {
    await placemarkService.clearAuth();
    try {
      await placemarkService.deleteAllUsers();
      console.log("Route not protected");
      assert.fail("Route not protected");
    } catch (error) { 
        assert.equal(error.response.data.statusCode, 401); 
    }
  });
});