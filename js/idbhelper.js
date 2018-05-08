/**
 * Common idb helper functions.
 */
class IDBHelper {
  static get dbPromise() {
    const dbPromise = idb.open('restaurants-db', 1);
    return dbPromise;
  }
  /**
   * Check if idb restaurants index exists
   */
  static databaseExists(dbname, callback) {
    var req = indexedDB.open(dbname);
    var existed = true;
    req.onsuccess = function () {
      req.result.close();
      if (!existed)
        indexedDB.deleteDatabase(dbname);
      callback(existed);
    }
    req.onupgradeneeded = function () {
      existed = false;
    }
  }
  /**
   * Delete idb restaurants index if exists
   */
  static deleteOldDatabase() {
    let DBDeleteRequest = window.indexedDB.deleteDatabase("restaurants-db");
    DBDeleteRequest.onerror = function () {
      console.log("Error deleting database.");
    };
    DBDeleteRequest.onsuccess = function () {
      console.log("Old db successfully deleted!");
    };
  }
  /**
   * Create new IDB restaurant index
   */
  static createNewDatabase() {
    idb.open('restaurants-db', 1, function (upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains('restaurants')) {
        upgradeDb.createObjectStore('restaurants', {keypath: 'id', autoIncrement: true});
      }
      console.log('restaurants-db has been created!');
    });
  };
  /**
   * Initialize data population
   */
  static populateDatabase(dbPromise) {
    fetch(DBHelper.DATABASE_URL)
      .then(res => res.json())
      .then(json => {
        json.map(restaurant => IDBHelper.populateRestaurantsWithReviews(restaurant, dbPromise))
      });
  };
  /**
   * Populate restaurants data including reviews
   */
  static populateRestaurantsWithReviews(restaurant, dbPromise) {
    let id = restaurant.id;
    fetch(`http://localhost:1337/reviews/?restaurant_id=${id}`)
      .then(res => res.json())
      .then(restoReviews => dbPromise.then(
        db => {
          const tx = db.transaction('restaurants', 'readwrite');
          const store = tx.objectStore('restaurants');

          let item = restaurant;
          item.reviews = restoReviews;
          store.put(item);
          tx.complete;
        })
      )
  }
  /**
   * Populate restaurants data without reviews (from P2 project)
   */
  static insertEachTransaction(restaurant, dbPromise) {
    dbPromise.then(db => {
      let tx = db.transaction('restaurants', 'readwrite');
      let store = tx.objectStore('restaurants');
      store.add(restaurant);
      return tx.complete
    });
    console.log('item has been inserted');
    IDBHelper.populateReviews(restaurant.id, dbPromise);
  }
  /**
   * Read all data from idb restaurants index
   */
  static readAllIdbData(dbPromise) {
    return dbPromise.then(db => {
      return db.transaction('restaurants')
        .objectStore('restaurants').getAll();
    })
  }
}