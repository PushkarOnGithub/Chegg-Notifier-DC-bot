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

// Upload A Collection to Firestore
async function uploadCollection(collectionName, documentId, dataToUpload){
  try {
    const documentRef = firebaseDb.collection(collectionName).doc(documentId);
    let uploadedData = await documentRef.set(dataToUpload);
    return uploadedData;
  } catch (error) {
    console.log("Error in uploading data", error);
  }
};

// Get A Collection from firebase
async function getCollection(collectionName){
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

module.exports = { uploadCollection, getCollection };
