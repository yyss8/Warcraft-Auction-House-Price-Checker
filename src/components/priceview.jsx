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
            totalPrice:0
        }
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
                comps[i]["resultStyle"] = "fa fa-spinner fa-pulse fa-2x pull-right";
            }
            this.setState({itemComps:comps});
        }

        if (nextProps.compPrice.comps != undefined){
            let currentItemComps = this.state.itemComps; //merge comps array with comp price array
            this.state.totalPrice = 0;
            for (var i = 0;i<currentItemComps.length;i++){
                currentItemComps[i].resultStyle = "pull-right";
                currentItemComps[i].price = nextProps.compPrice.comps[i].num == null ? (0).toString(): nextProps.compPrice.comps[i].num.toString(); //return 0 if no price found
                this.state.totalPrice += nextProps.compPrice.comps[i].num == null ? 0:nextProps.compPrice.comps[i].num;
            }
            this.state.totalPrice = this.state.totalPrice.toString();
        }
    }

    clearResult(){
        this.setState({selectedItem:{},itemComps:[],totalPrice:0});
    }

    render(){
        return(
            <div style={ {marginTop:10} }>
                <div className="panel panel-defaul" style={ {maxHeight:400,minHeight:150 } }>
                    {this.state.selectedItem.item != undefined &&
                        <div> 
                            <span className='list-group-item list-group-item-action'>
                                <img src={ "http://media.blizzard.com/wow/icons/56/" + this.props.selectedItem.icon + ".jpg" } height='40px' width='40px' />
                                <h4 className='pull-right'> { this.props.selectedItem.name } </h4>
                            </span>
                            <div className='row'>
                                <span className='glyphicon glyphicon-arrow-down col-md-offset-4 col-md-4' style={ arrowStyle } ></span>
                            </div>
                        </div>
                    }

                    { this.state.itemComps != undefined &&
                            this.state.itemComps.map(comp=>{
                                return(
                                    <span key={comp.compItem} className='list-group-item list-group-item-action'>
                                        <img src={ "http://media.blizzard.com/wow/icons/56/" + comp.icon + ".jpg" } height='40px' width='40px' />
                                        <span className='h4'> { comp.enName } </span>
                                        <span>&nbsp;<i className='fa fa-times'></i> &nbsp; <b>{ comp.quantity }</b> </span>
                                        <span className={ comp.resultStyle } style={ {marginTop:7} } > 
                                        { comp.price.length > 4 &&  comp.price.slice(0,comp.price.length - 4) != "" && 
                                            <span> { comp.price.slice(0,comp.price.length - 4) } 
                                                <img alt='g' src='/img/gold.png' /> 
                                            </span>
                                        }
                                        { comp.price.length > 2 && comp.price.slice(comp.price.length -4,comp.price.length - 2) != "" &&
                                            <span> { comp.price.slice(comp.price.length -4,comp.price.length - 2) }
                                                <img alt='g' src='/img/silver.png' /> 
                                            </span>
                                        }
                                        { comp.price.length > 0 && comp.price.slice(comp.price.length-2) != "" &&
                                            <span> { comp.price.slice(comp.price.length-2) }
                                                <img alt='g' src='/img/copper.png' /> 
                                            </span>
                                        }
                                        </span>
                                    </span> 
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
                        <div className='col-md-offset-3 col-md-7'>
                            <span className='pull-right'><img src='/img/equal.png' width='20px'/> &nbsp; 

                            { this.state.totalPrice.length > 4 &&  this.state.totalPrice.slice(0,this.state.totalPrice.length - 4) != "" && 
                                <span> { this.state.totalPrice.slice(0,this.state.totalPrice.length - 4) } 
                                    <img alt='g' src='/img/gold.png' /> 
                                </span>
                            }
                            { this.state.totalPrice.length > 2 && this.state.totalPrice.slice(this.state.totalPrice.length -4,this.state.totalPrice.length - 2) != "" &&
                                <span> { this.state.totalPrice.slice(this.state.totalPrice.length -4,this.state.totalPrice.length - 2) }
                                    <img alt='g' src='/img/silver.png' /> 
                                </span>
                            }
                            { this.state.totalPrice.length > 0 && this.state.totalPrice.slice(this.state.totalPrice.length-2) != "" &&
                                <span> { this.state.totalPrice.slice(this.state.totalPrice.length-2) }
                                    <img alt='g' src='/img/copper.png' /> 
                                </span>
                            }
                                
                            </span>
                        </div>
                        
                    </div>
                    <br/>
            </div>
        )
    }
}