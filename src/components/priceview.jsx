import React from 'react'
import { connect } from 'react-redux'



const arrowStyle = {
    marginTop:10,
    marginBottom:10,
    textAlign:"center",
    fontSize:20
}

@connect(store => {
    return {
        selectedItem:store.selectedItem,
        itemComps:store.itemComps,
        compPrice:store.compPrice
    };
})
export default class extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            selectedItem:{},
            itemComps:[],
            totalPrice:0,
            ahPrice:0
        }
        this.priceToTextWithCoins= this.priceToTextWithCoins.bind(this);
    }

    componentWillReceiveProps(nextProps){
        // receive selected item number from redux
        if (nextProps.selectedItem.item != undefined){
            this.setState({selectedItem:nextProps.selectedItem});
        }

        if (nextProps.itemComps.comps != undefined){
            let comps = nextProps.itemComps.comps.slice(); //add price field to comps array
            for (var i = 0;i<comps.length;i++){
                comps[i]["price"] = "";
                comps[i]["resultStyle"] = "fa fa-circle-o-notch fa-spin fa-2x fa-fw ";
                comps[i]["included"] = false
            }
            this.setState({itemComps:comps});
        }

        if (nextProps.compPrice.item !== undefined && nextProps.compPrice.item === this.state.selectedItem.item){
            
            let currentItemComps = [...this.state.itemComps]; //merge comps array with comp price array
            let totalPrice = 0
            let ahPrice = nextProps.compPrice.price === null ? (0).toString(): nextProps.compPrice.price.toString();
            for (var i = 0;i<currentItemComps.length;i++){
                currentItemComps[i].resultStyle = "";
                currentItemComps[i].price = nextProps.compPrice.comps[i].num === null ? (0).toString(): nextProps.compPrice.comps[i].num.toString(); //return 0 if no price found
                currentItemComps[i].included = true;
                totalPrice += nextProps.compPrice.comps[i].num == null ? 0:nextProps.compPrice.comps[i].num;
            }
            this.setState({
                ahPrice,
                totalPrice:totalPrice.toString(),
                itemComps:currentItemComps
            });
        }
    }

    clearResult(){
        this.setState({selectedItem:{},itemComps:[],totalPrice:0});
    }

    priceToTextWithCoins(price){
        return (
                <span>
                 {price.length > 4 &&  price.slice(0,price.length - 4) != "" && 
                    <span> { price.slice(0,price.length - 4) } 
                        <img alt='g' src='/img/gold.png' /> 
                 </span>}   
                
                {price.length > 2 && price.slice(price.length -4,price.length - 2) != "" &&
                    <span> { price.slice(price.length -4,price.length - 2) }
                        <img alt='g' src='/img/silver.png' /> 
                    </span>}
                
                 {price.length > 0 && price.slice(price.length-2) != "" &&
                    <span> { price.slice(price.length-2) }
                        <img alt='g' src='/img/copper.png' /> 
                    </span>}
                </span>
        )
    }

    totalPriceIncludesOnchange(index){
        let newAry = [...this.state.itemComps];
        newAry[index].included = !this.state.itemComps[index].included;
        let newPrice = Number(this.state.totalPrice);
        if (this.state.itemComps[index].included){
            newPrice += Number(this.state.itemComps[index].price);
        }else{
            newPrice -= Number(this.state.itemComps[index].price);
        }
        this.setState({
            itemComps:newAry,
            totalPrice:newPrice.toString()
        });
    }

    render(){
        return(
            <div style={ {marginTop:10} }>
                <div className="panel panel-defaul" style={ {maxHeight:600,minHeight:250 } }>
                    {this.state.selectedItem.item != undefined &&
                        <div> 
                            <span className='list-group-item list-group-item-action'>
                                <img src={ `http://media.blizzard.com/wow/icons/56/${ this.props.selectedItem.icon }.jpg` } width="30" />
                                <span className='pull-right h5'> { this.props.selectedItem.name } </span>
                            </span>
                            <div className='row'>
                                <span className='glyphicon glyphicon-arrow-down col-md-offset-4 col-md-4' style={ arrowStyle } ></span>
                            </div>
                        </div>
                    }

                    { this.state.itemComps != undefined &&
                            this.state.itemComps.map((comp,index)=>{
                                return(
                                    <li key={comp.compItem} className='list-group-item list-group-item-action'>
                                        <div className='row'>
                                            <span className='col-xs-1'>
                                                <img src={ `http://media.blizzard.com/wow/icons/56/${ comp.icon }.jpg` } width='30'/>
                                            </span>
                                            
                                            <span className='h5 col-xs-3'> { comp.enName } </span>
                                            <span className='col-xs-2' style={ {marginTop:7} }><span><i className='fa fa-times'></i><b>{ comp.quantity }</b></span></span>
                                            <span className='col-xs-5 h5 text-right' style={ {marginTop:8} }>
                                                <span className={ comp.resultStyle }  > 
                                                { this.priceToTextWithCoins(comp.price) }
                                                </span>
                                            </span>
                                            {
                                                comp.price != "" &&
                                                <span className='col-xs-1' style={ {marginTop:7} }><input type='checkbox' checked={ comp.included } onChange={ e=>this.totalPriceIncludesOnchange(index) } /></span>
                                            }
                                        </div>
 
                                    </li> 
                                )
                            })  
                    }
                </div>
                    <hr />
                    <div className='row'>
                        <div className='col-md-2'>
                            { this.state.itemComps.length != 0 && 
                            <div className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={ () => this.clearResult() } ><i className="glyphicon glyphicon-remove"></i></button>
                            </div>
                            }

                        </div>
                        <div className='col-md-offset-5 col-md-5 text-right'>
                            <strong>AH Price</strong>&nbsp;&nbsp;
                            { this.priceToTextWithCoins (this.state.ahPrice) }
                        </div>

                    </div>

                    <div className='row'>

                        <div className='col-md-offset-7 col-md-5 text-right'>
                            <strong>Comp Price</strong>&nbsp;&nbsp;
                            { this.priceToTextWithCoins (this.state.totalPrice) }
                        </div>
                     </div>
                    <br/>
            </div>
        )
    }
}