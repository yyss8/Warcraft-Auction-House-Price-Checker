export const updateTime = (time) =>{
    //action for data update time
    return {
        type:"updateTime",
        newTime:time
    }
}

export const selectItem = (item) => {
    //action for selecting item from result list
    return {
        type:'selectItem',
        item:item.item,
        icon:item.icon,
        name:item.name
    };
}

export const loadComps = (comps) =>{
    //action for loading comp items
    return {
        type:"loadComps",
        comps:comps
    }
}

export const loadPrice = (item) =>{
    //action for loading price
    return {
        type:"loadPrices",
        items:item
    }
}