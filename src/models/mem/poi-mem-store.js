import { v4 } from "uuid";

let pois = [];

export const poiMemStore = {
  async getAllPois() { return pois; },
  async getPoisByCategoryId(id) { return pois.filter((poi) => poi.categoryid === id); },
  async getPoiById(id) { 
    const POI = pois.find((poi) => poi._id === id); 
    if (POI === undefined) { return null }
    return POI
  },
  async getCategoryPois(categoryId) { return pois.filter((poi) => poi.categoryid === categoryId); },
  async deleteAllPois() { pois = []; },
  async addPoi(categoryId, poi) {
    poi._id = v4();
    poi.categoryid = categoryId;
    pois.push(poi);
    return poi;
  },
  async deletePoi(id) {
    const index = pois.findIndex((poi) => poi._id === id);
    if (index !== -1) pois.splice(index, 1);
  },
  async updatepoi(poi, updatedPoi) {
    poi.title = updatedPoi.title;
    poi.artist = updatedPoi.artist;
    poi.duration = updatedPoi.duration;
  },
};
