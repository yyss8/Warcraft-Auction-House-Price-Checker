import React from 'react'
import { connect } from 'react-redux'
import { selectItem,loadComps,loadPrice,updateTime} from "../actions/items.js"

const professions = ["Alchemy","Blacksmithing","Cooking","Enchanting","Engineering","First Aid","Inscription","Jewelcrafting","Leatherworking","Tailoring"];
const resultTxtStyle = {margin:"3px 0 0 0"};

const searchStyle = {
    overflowY:"auto",
    maxHeight:300
}

@connect(store =>{
    return {
        updateTime:store.updateTime
    }
}
)
export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            schKyWrds:"",
            schType:"Professions",
            selectedDb:"",
            hasError:false,
            errorMsg:"",
            items:[]
        };

        this.getItems = this.getItems.bind(this);
        this.getItemComps = this.getItemComps.bind(this);
        this.getUpdateTime = this.getUpdateTime.bind(this);
    }

    kyWrdChange(e){
        const _this = this;
        if (this.state.hasError && this.state.schType != "Professions"){
            this.setState({hasError:false});
        }

        if (e.target.value != ""){
            this.setState({schKyWrds:e.target.value});
            setTimeout(function(){
                _this.getItems();
            },100);
        }else{
            this.clearKyWrds();
        }
    }

    selectType(prof,db){
        if (this.state.hasError && this.state.schType != "Professions"){
            this.setState({hasError:false});
        }
        this.setState({schType:prof,selectedDb:db});
    }

    selectItem(item){
        this.props.dispatch(selectItem(item));
        this.getItemComps(item.item); //get item number
        this.setState({items:[]});
    }

    getItemComps(item){
        $.ajax({
            url:`/api/professions/${this.state.schType}/${item}/comps`,
            type:'GET',
            success:(r) =>{
                if (r.status == "ok"){
                    this.props.dispatch(loadComps(r.result.comp));
                    const items = {"main":item,comps:[]}
                    r.result.comp.forEach((c) => {
                        if (c.isAuctionable){
                            let compItems= {comp:c.compItem,quantity:c.quantity}
                            items.comps.push(compItems);
                        }
                    });
                    this.getItemPrice(items);
                }
            }
        });
    }

    getItemPrice(item){
        $.ajax({
            url:`/api/price/${item.main}/all/${JSON.stringify(item.comps)}`,
            type:'GET',
            success:(r) =>{
                this.props.dispatch(loadPrice(r.comps));
            }
        });        
    }

    getUpdateTime(){
        $.ajax({
            url:`/api/price/time`,
            type:'GET',
            success:(r) =>{
                this.props.dispatch(updateTime(r));
            }
        });    
    }

    getItems(){
        if (this.state.schKyWrds == ""){
            this.setState({
                hasError:true,
                errorMsg:"Please Enter Item Name."
            });
        }else if (this.state.schType == "Professions"){
            this.setState({
                hasError:true,
                errorMsg:"Please Select A Profession."
            });
        }else{
            $.ajax({
                url: `/api/professions/${this.state.schType}/all/${this.state.schKyWrds}`,
                type:'GET',
                success: (r) =>{
                    if (r.result.length != 0){
                        let itemAry = []
                        r.result.forEach((result) => {
                            let item = {icon:result.icon,item:result.item}
                            if (result.enName == undefined){
                                item["name"] = result.cnName;
                            }else{
                                item["name"] = result.enName;
                            }
                            itemAry.push(item);
                        });
                        this.setState({items:itemAry});
                    }else{
                        this.setState({items:[{name:"No Result"}]});
                    }
                }
            });
        }
    }

    clearKyWrds(){
        this.setState({
            schKyWrds:"",
            hasError:false,
            errorMsg:"",
            items:[]
        });
    }

    componentDidMount(){
        this.getUpdateTime();
    }

    render(){
        return (
            <div>
                <div className="row">
                    <div className='col-md-12'>
                        <b style={ {"color":"#8E8E8E"} } >Data Update Time: { this.props.updateTime }&nbsp;</b> 
                        <button className='btn-xs btn-default glyphicon glyphicon-repeat' onClick={this.getUpdateTime} ></button>
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-6'>
                        <b style={ {"color":"#8E8E8E"} } >Server: <span style={{"color":"#CF5151"}} >Illidan</span></b> 
                    </div>
                </div>
                <br />
                <div className="input-group">
                    <div className='input-group-btn'>
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.schType}&nbsp;
                                <span className="caret"></span>    
                            </button>
                            <ul className="dropdown-menu">
                                {professions.map(prof => {
                                    const selectType = this.selectType.bind(this,prof);
                                    return (<li key={prof}><a href='javascript:void(0)' onClick={ selectType } >&nbsp; {prof}</a></li>)
                                })}
                            </ul>
                        </div>
                    </div>
                    
                    <input className='form-control' type='text' value={ this.state.schKyWrds } onChange={ e=> this.kyWrdChange(e) } placeholder='Enter Item Name'/>
                    <div className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={ this.getItems }><i className="glyphicon glyphicon-search"></i></button>
                        {this.state.schKyWrds != "" && <button className="btn btn-default" type="button" onClick={ () => this.clearKyWrds() } ><i className="glyphicon glyphicon-remove"></i></button>}
                    </div>
                </div>
                {this.state.hasError && <div className='alert alert-danger'>{this.state.errorMsg}</div>}
                <ul className='nav nav-second-level' style={searchStyle}>
                    {this.state.items.map(item => {
                        if (item.name != "No Result"){
                            const selectItem = this.selectItem.bind(this,item);
                            return(<a key={item.item} className='list-group-item list-group-item-action' href='javascript:void(0)' onClick={ selectItem }>
                                        <img src={ "http://media.blizzard.com/wow/icons/56/" + item.icon + ".jpg" } width='30' />
                                        <span className='pull-right' style={resultTxtStyle}>{ item.name }</span>
                                    </a>
                                )
                            
                        }
                            return(<a key={item.name} className='list-group-item list-group-item-action' href='javascript:void(0)'>
                                        <span className="glyphicon glyphicon-question-sign" />
                                        <span className='pull-right'>{ item.name }</span>
                                    </a>
                                )                             
                    })
                    }
                </ul>
            </div>
        )
    }
}