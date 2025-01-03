require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

let firebaseDb;

// Initialise Firebase Admin SDK
const InitialiseFirebaseAdminApp = () => {
  try {
    // Initialize the admin app using service account
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseDb = admin.firestore();
    return admin;
  } catch (error) {
    console.log("Error in initializing firebase admin app or database", error);
  }
};

InitialiseFirebaseAdminApp();

const getCollection = async (collectionName) => {
  // Get a collection by its name
  try {
    const collectionRef = firebaseDb.collection(collectionName);
    const data = [];
    const snapshot = await collectionRef.get();

    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.log("Error in getting data", error);
  }
};

module.exports = { getCollection };