import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, beaches, testCategories, testPois, beach, maggieCredentials } from "../fixtures.js";

suite("POI API tests", () => {
  let user = null;
  let newBeaches = null;
  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllPois();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    beaches.userid = user._id;
    newBeaches = await placemarkService.createCategory(beaches);
  });
  teardown(async () => {});
  test("Create POI", async () => {
    const returnedPoi = await placemarkService.createPoi(newBeaches._id, beach);
    assertSubset(beach, returnedPoi);
  });
  test("Create multiple POIs", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPoi(newBeaches._id, testPois[i]);
    }
    const returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, testPois.length);
    for (let i = 0; i < returnedPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await placemarkService.getPoi(returnedPois[i]._id);
      assertSubset(poi, returnedPois[i]);
    }
  });
  test("Delete POI", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPoi(newBeaches._id, testPois[i]);
    }
    let returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, testPois.length);
    for (let i = 0; i < returnedPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await placemarkService.deletePoi(returnedPois[i]._id);
    }
    returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, 0);
  });
  test("Denormalised category", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPoi(newBeaches._id, testPois[i]);
    }
    const returnedCategory = await placemarkService.getCategory(newBeaches._id);
    assert.equal(returnedCategory.pois.length, testPois.length);
    for (let i = 0; i < testPois.length; i += 1) {
      assertSubset(testPois[i], returnedCategory.pois[i]);
    }
  });
});