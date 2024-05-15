import React, { useState, useEffect } from "react";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";
import { Button } from "@trussworks/react-uswds";

const App = () => {
  const [formData, setFormData] = useState([]);

  const {
    findOfflineData,
    createOfflineData,
    updateOfflineData,
    deleteOfflineData,
  } = useOfflineStorage();

  useEffect(() => {
    const getFormData = async () => {
      const data = await findOfflineData("formData");
      setFormData(data);
    };
    getFormData();
  }, []);

  const createData = async (e) => {
    e.preventDefault();
    const newData = {
      fullName: "Bilbo Baggins",
      species: "Mahimahi",
      computedPrice: 100,
      numberOfFish: 5,
      isDraft: true,
    };
    // Takes a string for the store name and an object to create
    await createOfflineData("formData", newData);
    const allData = await findOfflineData("formData");
    setFormData(allData);
  };

  const updateData = async (e) => {
    e.preventDefault();
    if (formData.length > 0) {
      const updatedData = {
        uuid: formData[0].uuid,
        fullName: formData[0].fullName,
        species: formData[0].species,
        computedPrice: (formData[0].computedPrice += 1),
        numberOfFish: (formData[0].numberOfFish += 1),
        isDraft: true,
      };
      // Takes a string for the store name and an array of objects to update
      await updateOfflineData("formData", [updatedData]);
      setFormData((prevData) =>
        prevData.map((data) =>
          data.uuid === updatedData.uuid ? updatedData : data
        )
      );
    }
  };

  const deleteData = async (e) => {
    e.preventDefault();
    if (formData.length > 0) {
      // Takes a string for the store name and an array of uuids to delete
      await deleteOfflineData("formData", [formData[0].uuid]);
      setFormData((prevData) =>
        prevData.filter((data) => data.uuid !== formData[0].uuid)
      );
    }
  };

  return (
    <div>
      <h1>On Device Storage</h1>
      <Button type="submit" onClick={(e) => createData(e)}>
        Create Data
      </Button>
      <Button type="submit" onClick={(e) => updateData(e)}>
        Update Data
      </Button>
      <Button type="submit" onClick={(e) => deleteData(e)}>
        Delete Data
      </Button>

      <h2>Saved Data</h2>
      {formData &&
        formData.map((data, i) => {
          return (
            <ul key={i}>
              <li>UUID: {data.uuid}</li>
              <li>Full Name: {data.fullName}</li>
              <li>Species: {data.species}</li>
              <li>Number of Fish: {data.numberOfFish}</li>
              <li>Price: {data.computedPrice}</li>
              <li>Status: {data.isDraft ? "Draft" : "Submitted"}</li>
              <hr />
            </ul>
          );
        })}
    </div>
  );
};

export default App;
