import { Application, IndexedDBMethod, LocalStorageMethod } from './index';

describe('Application',  () => {
  describe('storage',  () => {
    it('should return the storage method',  () => {
      // IndexedDB Storage application
      const indexedDBMethod = new IndexedDBMethod(
        "test",
        1,
        {
          formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
          species: "name, price",
          homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
        },
      );
      const indexedDBApplication = new Application({
        storage: indexedDBMethod,
      });
      expect (indexedDBApplication.storage).toEqual(indexedDBMethod);

      // Local Storage application
      const localStorageMethod = new LocalStorageMethod(
        "test",
        {
          formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
          species: "name, price",
          homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
        },
      );
      const localStorageApplication = new Application({
        storage: localStorageMethod,
      });
      expect(localStorageApplication.storage).toEqual(localStorageMethod);
    });

    it('should return the storage method using a configuration object', function () {
      const indexedDBApplication = new Application(
        {
          storage: {
            type: "indexedDB",
            name: "test",
            version: 1,
            stores: {
              formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
              species: "name, price",
              homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
            }
          }
        }
      )
      expect(indexedDBApplication.storage).toBeInstanceOf(IndexedDBMethod);

      const localStorageApplication = new Application(
        {
          storage: {
            type: "localStorage",
            name: "test",
            stores: {
              formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
              species: "name, price",
              homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
            }
          }
        }
      )
      expect(localStorageApplication.storage).toBeInstanceOf(LocalStorageMethod);
    });
  });
});