'use strict';
/* global shoppingList, store, Item */
// eslint-disable-next-line no-unused-vars

const Api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/NPaul5656/';
  const getItems = function(){
    return fetch(`${BASE_URL}items`);
  };

  const createItem = function(name){
    const newItem= JSON.stringify({
      name,
    });
    const options={
      method:'POST',
      body: newItem,
      headers: new Headers({'Content-Type': 'application/json'})
    };
    return fetch(`${BASE_URL}items`, options);

  };


  return {
    getItems,
    createItem,
  };
}());