'use strict';
/* global shoppingList, store, Item */
// eslint-disable-next-line no-unused-vars

const Api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/NPaul5656';
  const getItems = function(){
    return Promise.resolve('A successful response!');
  };


  return {
    getItems,
  };
}());