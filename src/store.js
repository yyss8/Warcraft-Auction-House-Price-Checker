import { createStore,combineReducers } from "redux";

const selectedItemReducer = (state={},action) => {
    switch (action.type){
        case "selectItem":
            return {item: action.item,icon:action.icon,name:action.name}
            break;
        default:
            return state
    }
}

const itemCompsReducer = (state={},action) => {
    switch (action.type){
        case "loadComps":
            return {comps:action.comps}
            break;

        default:
            return state   
    }
}

const compPriceReducer = (state={},action) =>{
    switch (action.type){
        case "loadPrices":
            return {item:action.items.item,price:action.items.price,comps:action.items.comps}
            break;
        default:
            return state
    }
}

const updateTimeReducer = (state="None",action) =>{
    switch (action.type){
        case "updateTime":
            return action.newTime
            break;
        default:
            return state
    }
}

const loginReducer = (state="None",action) => {
    switch (action.type){
        case "login":
            return action.user
            break;
        default:
            return state
    }
}


const reducers = combineReducers({
    selectedItem:selectedItemReducer,
    itemComps:itemCompsReducer,
    compPrice:compPriceReducer,
    updateTime:updateTimeReducer,
    login:loginReducer
})

const store = createStore(reducers);



export default store;