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
        total: 0
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
            newItem = new Item(ID, name, calories)
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
        logData: function (){
            return data
        }
    }

})();

// UI Controller
const UICtrl = (function () {
    // UI selectors
    const UISelectors = {
        itemList: "#item-list",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        addBtn: ".add-btn",
        totalCalories: '.total-calories'
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