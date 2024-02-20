import { useEffect, useState } from "react";
import { LocalStorageMethod, StorageModelFactory } from "../storage";

function useFormStorage() {
  const storageMethod = new LocalStorageMethod("formData");
  const storageModel = StorageModelFactory.createModel(storageMethod);

  const [store, setStore] = useState();

  useEffect(() => {
    if (!store) {
      setStore(storageModel.find());
    }
  }, [store, storageModel]);

  function create(data) {
    return storageModel.create(data);
  }

  function find(criteria) {
    return storageModel.find(criteria);
  }

  function update(criteria, data) {
    return storageModel.update(criteria, data);
  }

  return {
    store,
    create,
    find,
    update,
  };
}

export default useFormStorage;
