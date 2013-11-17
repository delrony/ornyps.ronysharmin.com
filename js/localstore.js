// TODO create a class for these functions with properties key and listArray

/**
 * Save one item in the localstorage for a particular key
 * @param item: Item to be stored (i.e. task)
 * @param key: key of the localstorage (i.e. todo)
 * 
 * @returns nothing
 */
function save(item, key) {
    var listArray = getSavedList(key);
    listArray.push(item);
    saveList(key, listArray);
}

/**
 * Save an array of items in localstorage
 * @param key: key of the localstorage (i.e. todo)
 * @param listArray: Array of items to be stored (i.e. array of tasks)
 * 
 * @returns nothing
 */
function saveList(key, listArray) {
    localStorage.setItem(key, JSON.stringify(listArray));
}

/**
 * Get the stored array of items from localstorage
 * @param key: key of the localstorage (i.e. todo)
 * 
 * @returns array of items
 */
function getSavedList(key) {
    var listArray = localStorage.getItem(key);
    if (listArray == null || listArray == "") {
        listArray = new Array();
    } else {
        listArray = JSON.parse(listArray);
    }
    return listArray;
}