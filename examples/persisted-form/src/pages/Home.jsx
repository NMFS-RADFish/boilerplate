import "../index.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormGroup, TextInput, Label, Button, Form } from "@trussworks/react-uswds";
import { useOfflineStorage, dispatchToast } from "@nmfs-radfish/react-radfish";

const HomePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const { findOfflineData, createOfflineData, updateOfflineData } = useOfflineStorage();

  useEffect(() => {
    findExistingForm();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      saveOfflineData("formData", updatedForm);
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {};

    for (let [key, value] of formData.entries()) {
      values[key] = value;
    }

    if (!id) {
      const formId = await createOfflineData("formData", values);
      navigate(`${formId}`);
      dispatchToast({ status: "success", message: "Your form has been successfully saved offline! You can now revisit it anytime." });
    } else {
      await saveOfflineData("formData", [values]);
      dispatchToast({ status: "success", message: "Your changes have been saved! The form has been updated successfully." });
      // after updating the data in IndexedDB, we can execute any other logic here
      // eg. execute a POST request to an API
    }
  };

  // helper functions to save and find data in IndexedDB asyncrounously
  // useEffect is syncronous, so this abstraction is necessary
  // we only want to update this data on existing forms, else Dexie will throw a "weakMap" error due to uuid not existing in the table
  const saveOfflineData = async (tableName, data) => {
    if (id) {
      await updateOfflineData(tableName, [{ uuid: id, ...data }]);
    }
  };

  const findExistingForm = async () => {
    if (id) {
      const [found] = await findOfflineData("formData", {
        uuid: id,
      });

      if (found) {
        setFormData({ ...found });
      } else {
        navigate("/");
      }
    }
  };

  return (
    <Form
      className="maxw-full margin-205 padding-205 bg-white radius-8px shadow-2"
      onSubmit={handleSubmit}
    >
      <FormGroup>
        <Label className="text-bold" htmlFor="fullName">
          Name
        </Label>
        <TextInput
          id="fullName"
          name="fullName"
          type="text"
          value={formData?.fullName || ""}
          onChange={handleChange}
        />
        <Label className="text-bold" htmlFor="numberOfFish">
          Number of Fish
        </Label>
        <TextInput
          id="numberOfFish"
          name="numberOfFish"
          type="number"
          value={formData?.numberOfFish || ""}
          onChange={handleChange}
        />
        <Label className="text-bold" htmlFor="species">
          Species
        </Label>
        <TextInput
          id="species"
          name="species"
          type="text"
          value={formData?.species || ""}
          onChange={handleChange}
        />
        <Label className="text-bold" htmlFor="computedPrice">
          Price (Dollars)
        </Label>
        <div className="input-wrapper">
          <span className="dollar-sign">$</span>
          <TextInput
            id="computedPrice"
            name="computedPrice"
            type="number"
            value={formData?.computedPrice || ""}
            onChange={handleChange}
            className="dollar-input"
          />
        </div>
        <Button type="submit" className="margin-top-2">
          Submit
        </Button>
      </FormGroup>
    </Form>
  );
};

export default HomePage;
