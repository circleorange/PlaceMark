import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low(new JSONFile("./src/models/json/pois.json"));
db.data = { pois: [] };
export const poiJsonStore = {
  async getAllPois() {
    await db.read();
    return db.data.pois;
  },
  async addPoi(categoryId, poi) {
    await db.read();
    poi._id = v4();
    poi.categoryid = categoryId;
    db.data.pois.push(poi);
    await db.write();
    return poi;
  },
  async getPoisByCategoryId(id) {
    await db.read();
    return db.data.pois.filter((poi) => poi.categoryid === id);
  },
  async getPoiById(id) {
    await db.read();
    const POI = db.data.pois.find((poi) => poi._id === id);
    if (POI === undefined) { return null }
    return POI
  },
  async deletePoi(id) {
    await db.read();
    const index = db.data.pois.findIndex((poi) => poi._id === id);
    if (index !== -1) db.data.pois.splice(index, 1);
    await db.write();
  },
  async deleteAllPois() {
    db.data.pois = [];
    await db.write();
  },
  async updatePois(poi, updatedPoi) {
    poi.name = updatedPoi.name;
    poi.description = updatedPoi.description;
    poi.latitude = updatedPoi.latitude;
    poi.longitude = updatedPoi.longitude;
    await db.write();
  },
};
