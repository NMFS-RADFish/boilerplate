import { useEffect, useState } from "react";
import { LocalStorageMethod, StorageModelFactory } from "../storage";

function useFormStorage() {
  const localStorageMethod = new LocalStorageMethod("formData");
  const localStorageModel = StorageModelFactory.createModel(localStorageMethod);

  const [store, setStore] = useState();

  useEffect(() => {
    if (!store) {
      setStore(localStorageModel.find());
    }
  }, [store, localStorageModel]);

  function create(data) {
    return localStorageModel.create(data);
  }

  function find(criteria) {
    return localStorageModel.find(criteria);
  }

  function update(criteria, data) {
    return localStorageModel.update(criteria, data);
  }

  return {
    store,
    create,
    find,
    update,
  };
}

export default useFormStorage;
