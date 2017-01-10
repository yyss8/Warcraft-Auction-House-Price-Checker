export const updateTime = (time) =>{
    return {
        type:"updateTime",
        newTime:time
    }
}

export const selectItem = (item) => {
    return {
        type:'selectItem',
        item:item.item,
        icon:item.icon,
        name:item.name
    };
}

export const loadComps = (comps) =>{
    return {
        type:"loadComps",
        comps:comps
    }
}

export const loadPrice = (item) =>{
    return {
        type:"loadPrices",
        items:item
    }
}