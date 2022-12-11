// Storage Controller
const StorageCtrl = (function (){
    // public methods
    return {
        storeItem: function (item){
            let items;
            // check if any items in ls
            if(localStorage.getItem("items") === null){
                items = []
                // push new item
                items.push(item)
                // set ls
                localStorage.setItem("items", JSON.stringify(items))
            } else {
                // get what is already in ls
                items = JSON.parse(localStorage.getItem("items"))
                // push new item
                items.push(item)
                // reset ls
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem("items") === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items
        },
        updateLocalStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"))
            items.forEach((item, i) => {
                if (item.id === updatedItem.id) {
                    items.splice(i, 1, updatedItem)
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        }
    }
})();
// Item Controller
const itemCtrl = (function () {
    const Item = function (id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        items: [],
        total: 0,
        currentItem: null
    }

    return {
        getItems: function (){
            return data.items
        },
        addItem: function(name,calories) {
            let ID;
            // Create ID
            if (data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
            }
            else {
                ID = 0
            }
            // calories to number
            calories = parseInt(calories)
            // create new item
            let newItem = new Item(ID, name, calories)
            // add to items array
            data.items.push(newItem)
            // return new item
            return newItem

        },

        getTotalCalories: function (){
            let total = 0;
            data.items.forEach(function (item){
                total = total + item.calories;
            });
            data.total = total;
            console.log(data.total)
            return data.total
        },
        setCurrentItem: function (item){
            data.currentItem = item
            console.log(item)
        },
        getCurrentItem: function () {
            return data.currentItem
        },
        getItemByID: function (id){
            let idItem;
            data.items.forEach((item) => {
                if (item.id === id) {
                    idItem = item
                }
            })
            return idItem

        },
        updateItem: function (id, name, calories) {
            let updatedItem = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    item.name = name
                    item.calories = parseInt(calories)
                    updatedItem = item
                }
            })
            return updatedItem
        },
        logData: function (){
            return data
        }


    }

})();

// UI Controller
const UICtrl = (function () {
    let selectedItem;
    // UI selectors
    const UISelectors = {
        itemList: "#item-list",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        addBtn: ".add-btn",
        totalCalories: '.total-calories',
        updateBtn: ".update-btn",
        listItem: ".edit-item"
    }
    return {
        populateItemList: function (items){
            let html = "";

            items.forEach(function (item){
                html += `<li class="collection-item" id="item-${item.id}">
        		<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        		<a href="#" class="secondary-content">
          			<i class="edit-item fa fa-pencil"></i>
        		</a>
      			</li>`;
            })

            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        getSelectors: function() {
            return UISelectors
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
            },
        showTotalCalories: function (totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
            },
        addUpdateButton: function (event){
            if (event.target.className === "edit-item fa fa-pencil") {
                document.querySelector(UISelectors.addBtn).style.display = "none"
                document.querySelector(UISelectors.updateBtn).style.display = "inline"
                itemCtrl.setCurrentItem(event.target.parentElement.parentElement)
                itemCtrl.getCurrentItem()
            }
        },
        updateMeal: function (item) {
            const meals = document.querySelectorAll("#item-list li");
            const listItemsConvert = Array.from(meals);
            listItemsConvert.forEach((li) => {
                const liID = li.getAttribute("id");
                if (liID === `item-${parseInt(item.id)}`) {
                    li.innerHTML = `
            <strong>${item.name}</strong>: <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        addMeal: function () {
            const currentItem = itemCtrl.getCurrentItem();
            document.querySelector(UISelectors.itemNameInput).value = currentItem.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = currentItem.calories;
        },
        stopEdit: function () {
            UICtrl.clearInput()
            document.querySelector(UISelectors.updateBtn).style.display = "none"
            document.querySelector(UISelectors.addBtn).style.display = "inline"
        },
        updateTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).innerHTML = totalCalories
        }
    }

})();

// App Controller
const App = (function (itemCtrl, StorageCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function() {
        console.log("event listeners loading")
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
        // add document reload event
        document.addEventListener("DOMContentLoaded", getItemsFromStorage)
        // add edit event
        document.querySelector("ul").addEventListener("click", UICtrl.addUpdateButton)
        document.querySelector(UISelectors.updateBtn).addEventListener("click", UICtrl.updateMeal)
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdate)
        document.querySelector(UISelectors.updateBtn).addEventListener("click", UICtrl.addMeal)

    }
    const itemAddSubmit = function(event) {
        const input = UICtrl.getItemInput()
        if (input.name !== "" && input.calories !== "") {
           const newItem = itemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            // get total calories
            const totalCalories = itemCtrl.getTotalCalories()
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // store in localStorage
            StorageCtrl.storeItem(newItem)
            // clear fields
            UICtrl.clearInput();
        }
        event.preventDefault()
    }
    // get items from storage
    const getItemsFromStorage = function() {
        // get items from storage
        const items = StorageCtrl.getItemsFromStorage()
        // set storage items to ItemCtrl data items
        items.forEach(function(item){
            itemCtrl.addItem(item["name"], item["calories"])
        })
        // get total calories
        const totalCalories = itemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories)
        // populate items list
        UICtrl.populateItemList(items)
    }
    const itemEditClick = function (event) {
        if (event.target.classList.contains("edit-item")) {
            const listID = event.target.parentNode.parentNode.id;
            const listIdArr = listID.split("-");
            const id = parseInt(listIdArr[1]);
            const itemToEdit = itemCtrl.getItemByID(id);
            itemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addMeal();
        }
        event.preventDefault();
    };
    const itemUpdate = function (event) {
        const input = UICtrl.getItemInput();
        const itemId = itemCtrl.getCurrentItem().id;
        
        const updatedItemSubmit = itemCtrl.updateItem(
            itemId,
            input.name,
            input.calories
        )

        UICtrl.updateMeal(updatedItemSubmit);
        const totalCal = itemCtrl.getTotalCalories();
        UICtrl.updateTotalCalories(totalCal);
        UICtrl.stopEdit();
        StorageCtrl.updateLocalStorage(updatedItemSubmit);
        UICtrl.clearInput();
        event.preventDefault();
    };

    return {
        init: function (){
            console.log("Initializing App")
            // fetch Items from data structure
            const items = itemCtrl.getItems()
            // populate items list
            UICtrl.populateItemList(items)
            // load event listeners
            loadEventListeners()
        }
    }
})(itemCtrl, StorageCtrl, UICtrl)

// Initialize App
App.init()