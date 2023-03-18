import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategories, testPois, ringforts, beaches, beach, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Poi Model Tests", () => {
  let ringfortsList = null;
  setup(async () => {
    db.init("json");
    await db.categoryStore.deleteAllCategories();
    await db.poiStore.deleteAllPois();
    ringfortsList = await db.categoryStore.addCategory(ringforts);
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPois[i] = await db.poiStore.addPoi(ringfortsList._id, testPois[i]);
    }
  });
  test("Create POI", async () => {
    const beachesList = await db.categoryStore.addCategory(beaches);
    const poi = await db.poiStore.addPoi(beachesList._id, beach)
    assert.isNotNull(poi._id);
    assertSubset (beach, poi);
  });

  test("Get multiple POIs", async () => {
    const pois = await db.poiStore.getPoisByCategoryId(ringfortsList._id);
    assert.equal(pois.length, testPois.length)
  });
  test("Delete all POIs", async () => {
    const pois = await db.poiStore.getAllPois();
    assert.equal(testPois.length, pois.length);
    await db.poiStore.deleteAllPois();
    const newPois = await db.poiStore.getAllPois();
    assert.equal(0, newPois.length);
  });
  test("Get POI - Success", async () => {
    const beachesList = await db.categoryStore.addCategory(beaches);
    const poi = await db.poiStore.addPoi(beachesList._id, beach)
    const newPoi = await db.poiStore.getPoiById(poi._id);
    assertSubset (beach, newPoi);
  });
  test("Delete POI - Success", async () => {
    await db.poiStore.deletePoi(testPois[0]._id);
    const pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, testCategories.length - 1);
    const deletedPoi = await db.poiStore.getPoiById(testPois[0]._id);
    assert.isNull(deletedPoi);
  });
  test("Get invalid POI - Bad Params", async () => {
    assert.isNull(await db.poiStore.getPoiById(""));
    assert.isNull(await db.poiStore.getPoiById());
  });
  test("Delete invalid POI - Fail", async () => {
    await db.poiStore.deletePoi("bad-id");
    const pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, testCategories.length);
  });
});