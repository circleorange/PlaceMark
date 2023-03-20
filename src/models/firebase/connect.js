import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
// ESLint validation issues (due to assert not being supported yet)
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
dotenv.config();

export function connectFirebase() {
  const app = admin.initializeApp({
    credential: firebase .credential.cert(serviceAccount),
    databaseURL: process.env.RTDB_URL,
  });
}

// Initialize Realtime Database and get a reference to the service
export var database = admin.database();