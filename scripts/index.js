'use strict';
/* global shoppingList, store, Item, Api */
// eslint-disable-next-line no-unused-vars
$(document).ready(function() {
  shoppingList.bindEventListeners();
  shoppingList.render();
  Api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      const item = store.items[2];
      console.log('current name: ' + item.name);
      store.findAndUpdate(item.id, { name: 'foobar' });
      console.log('new name: ' + item.name);
      shoppingList.render();
    });
});


