import { database } from "./connect.js";

export const poiFirebaseStore = {
    async addPoi(categoryId, poi) {
      poi.categoryid = categoryId;
      const newPoiRef = database.ref("pois").push();
      await newPoiRef.set(poi);
      const snapshot = await newPoiRef.once("value");
      const newPoi = snapshot.val();
      newPoi.id = snapshot.key;
      return newPoi;
    },
    async getPoiById(id) {
      const snapshot = await database.ref(`pois/${id}`).once("value");
      const poi = snapshot.val();
      if (poi) { poi.id = snapshot.key; }
      return poi;
    },
    async getPoisByCategoryId(id) {
      const pois = [];
      const snapshot = await database
        .ref("pois")
        .orderByChild("categoryid")
        .equalTo(id)
        .once("value");
      snapshot.forEach((childSnapshot) => {
        const poi = childSnapshot.val();
        poi.id = childSnapshot.key;
        pois.push(poi);
      });
      return pois;
    },
    async getAllPois() {
      const pois = [];
      const snapshot = await database.ref("pois").once("value");
      snapshot.forEach((childSnapshot) => {
        const poi = childSnapshot.val();
        poi.id = childSnapshot.key;
        pois.push(poi);
      });
      return pois;
    },
    async deletePoi(id) {
      await database.ref(`pois/${id}`).remove();
    },
    async deleteAllPois() {
      await database.ref("pois").remove();
    },
    async updatePoi(poi, updatedPoi) {
      const poiRef = database.ref(`pois/${poi.id}`);
      await poiRef.update(updatedPoi);
    },
  };