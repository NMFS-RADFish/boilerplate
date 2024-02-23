import Dexie from "dexie";

export const db = new Dexie(process.env.REACT_APP_INDEXED_DB_NAME);

db.version(process.env.REACT_APP_INDEXED_DB_VERSION).stores({
  formData:
    "uuid, fullName, email, phoneNumber, numberOfFish, address1, address2, city, state, zipcode, occupation, department, species, computedPrice",
});
