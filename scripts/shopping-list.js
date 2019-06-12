'use strict';
/* global store, $, Api */

// eslint-disable-next-line no-unused-vars
const shoppingList = (function(){

  function generateItemElement(item) {
    const checkedClass = item.checked ? 'shopping-item__checked' : '';
    const editBtnStatus = item.checked ? 'disabled' : '';

    let itemTitle = `<span class="shopping-item ${checkedClass}">${item.name}</span>`;
    if (item.isEditing) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item" type="text" value="${item.name}" />
        </form>
      `;
    }
  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-edit js-item-edit" ${editBtnStatus}>
            <span class="button-label">edit</span>
          </button>
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }
  
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    if(store.errorKey){
      $('.error-message').append(`${store.errorKey} <br>`);
      $('.error-pop').removeClass('hidden');
    }
    let items = [ ...store.items ];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
    store.errorKey='';
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }
  
  
  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');
      Api.createItem(newItemName)
        .then(response=> {
          store.addItem(response);
          render();
        })
        .catch(error=>{
          store.errorKey=`Unable to add. ${error.message}`;
          render();
        });
        
      
    });
  }
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }
  
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const newItem = store.findById(id);
      const updateObj = {
        checked: !newItem.checked,
      };
      console.log(updateObj.checked);
      Api.updateItem(id, updateObj)
        .then(() =>{
          updateObj.isEditing = false;
          store.findAndUpdate(id, updateObj);
          render();
        })
        .catch(error=>{
          store.errorKey=`Unable to update check. ${error.message}`;
          render();
        });
      
    });
  }
  
  function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      const id = getItemIdFromElement(event.currentTarget);
      Api.deleteItem(id)
        .then(()=> {
          store.findAndDelete(id);
          render();
        })
        .catch(error=>{
          store.errorKey=`Unable to delete. ${error.message}`;
          render();
        });
    });
  }
  
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const newName = {
        name: $(event.currentTarget).find('.shopping-item').val()
      };
      Api.updateItem(id, newName)
        .then(()=>{
          store.findAndUpdate(id, newName);
          render();
        })
        .catch(error=>{
          store.errorKey=`Unable to edit. ${error.message}`;
          render();
        });
      
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleItemStartEditing() {
    $('.js-shopping-list').on('click', '.js-item-edit', event => {
      const id = getItemIdFromElement(event.target);
      store.setItemIsEditing(id, true);
      render();
    });
  }

  function handleCloseErrorPop(){
    $('.error-pop').on('click','.error-close', (e)=>{
      e.preventDefault();
      console.log($(e.delegateTarget));
      $(e.delegateTarget).addClass('hidden');
      $(e.delegateTarget).children('p').html('');
      store.errorKey='';
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleItemStartEditing();
    handleCloseErrorPop();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
