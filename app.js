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
                console.log(ID)
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
        addBtn: ".add-btn"
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
            }
    }

})();

// App Controller
const App = (function (itemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function() {
        console.log("event listeners loading")
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).
        addEventListener("click", itemAddSubmit);
    }
    const itemAddSubmit = function(event) {
        const input = UICtrl.getItemInput()
        if (input.name !== "" && input.calories !== "") {
           const newItem = itemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            UICtrl.clearInput();
        }
        event.preventDefault()
    }

    return {
        init: function (){
            console.log("Initializing App")
            // fetch Items from data structure
            const items = itemCtrl.getItems()
            UICtrl.populateItemList(items)
            // load event listeners
            loadEventListeners()
        }
    }
})(itemCtrl, UICtrl)

// Initialize App
App.init()