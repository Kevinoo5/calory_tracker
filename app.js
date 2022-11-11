// Item Controller
const itemCtrl = (function () {
    const Item = function (id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
            ],
        total: 0
    }

    return {
        getItems: function (){
            return data.items
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
        itemList: "#item-list"
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
        }
    }
})();

const App = (function (itemCtrl, UICtrl){
    return {
        init: function (){
            console.log("Initializing App")
            // fetch Items from data structure
            const items = itemCtrl.getItems()
            UICtrl.populateItemList(items)
        }
    }
})(itemCtrl, UICtrl)

// Initialize App
App.init()