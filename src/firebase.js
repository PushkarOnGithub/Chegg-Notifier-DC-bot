require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

let firebaseDb;
const collectionName = process.env.collectionName;

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

// Upload Data to Firestore
const uploadData = async (dataToUpload) => {
  try {
    const documentRef = firebaseDb.collection(collectionName).doc(dataToUpload.name);
    let uploadedData = await documentRef.set(dataToUpload);
    return uploadedData;
  } catch (error) {
    console.log("Error in uploading data", error);
  }
};

// Get Cookies (Documents from Firestore)
const getCookies = async () => {
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

// Export the functions
const getFireBaseApp = () => admin;

module.exports = { getFireBaseApp, uploadData, getCookies };
