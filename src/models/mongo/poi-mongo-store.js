import { Poi } from "./poi.js";

export const poiMongoStore = {
  async addPoi(playlistId, poi) {
    poi.playlistid = playlistId;
    const newPoi = new Poi(poi);
    const poiObj = await newPoi.save();
    return this.getPoiById(poiObj._id);
  },
  async getPoiById(id) {
    if (id) {
      const poi = await Poi.findOne({ _id: id }).lean();
      return poi;
    }
    return null;
  },
  async getPoisByCategoryId(id) {
    const pois = await Poi.find({ playlistid: id }).lean();
    return pois;
  },
  async getAllPois() {
    const pois = await Poi.find().lean();
    return pois;
  },
  async deletePoi(id) {
    try {
      await Poi.deleteOne({ _id: id });
    } catch (error) {
      console.log("POI ID not found");
    }
  },
  async deleteAllPois() { await Poi.deleteMany({}); },
  async updatePoi(poi, updatedPoi) {
    const poiDoc = await Poi.findOne({ _id: poi._id });
    poiDoc.title = updatedPoi.title;
    poiDoc.artist = updatedPoi.artist;
    poiDoc.duration = updatedPoi.duration;
    await poiDoc.save();
  },
};