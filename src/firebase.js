require("dotenv").config();
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
} = require("firebase/firestore");
const { firebaseConfig } = require("./firebaseCreds.js");

let app;
let firebaseDb;
const collectionName = process.env.collectionName;
// Initialise
const InitialiseFirebaseApp = () => {
  try {
    app = initializeApp(firebaseConfig);
    firebaseDb = getFirestore();
    return app;
  } catch (error) {
    console.log("Error in initialising firebase app or database", error);
  }
};

InitialiseFirebaseApp();

// Upload
const uploadData = async (dataToUpload) => {
  try {
    const document = doc(firebaseDb, collectionName, dataToUpload.name);
    let uploadedData = await setDoc(document, dataToUpload);
    return uploadedData;
  } catch (error) {
    console.log("Error in uploading", error);
  }
};

// Get
const getCookies = async () => {
  try {
    const collectionRef = collection(firebaseDb, collectionName);
    const data = [];
    const q = query(collectionRef);

    const docSnap = await getDocs(q);

    docSnap.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.log("Error in getting data", error);
  }
};

const getFireBaseApp = () => app;

module.exports = {getFireBaseApp, uploadData, getCookies };
