import React from 'react'
import { connect } from 'react-redux'
import { selectItem,loadComps,loadPrice,updateTime} from "../actions/items.js"
import update from "react-addons-update";
import ProfList from './minorcomponents/professionselect.jsx';

const resultTxtStyle = {margin:"3px 0 0 0"};
let typingTimer;

const searchStyle = {
    overflowY:"auto",
    maxHeight:400
}

@connect(store =>{
    return {
        updateTime:store.updateTime
    }
})
export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            schKyWrds:"",
            schType:"Professions",
            selectedDb:"",
            hasError:false,
            errorMsg:"",
            items:[],
            currentItems:{
                pageNum:1,
                items:[]
            }
        };

        this.getItems = this.getItems.bind(this);
        this.getAllItems = this.getAllItems.bind(this);
        this.getItemComps = this.getItemComps.bind(this);
        this.getUpdateTime = this.getUpdateTime.bind(this);
        this.getPageItems = this.getPageItems.bind(this);
    }

    kyWrdChange(e){
        const _this = this;
        if (this.state.hasError && this.state.schType != "Professions"){
            this.setState({hasError:false});
        }

        if (e.target.value != ""){
            this.setState({schKyWrds:e.target.value});
            //wait 3 seconds until user finish typing.
            this.setState({
                items:[],
                currentItems:{
                    pageNum:1,
                    items:[{name:"Loading"}]
            }});
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() =>{
                _this.getItems();
            }, 1200);
           
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
        this.clearKyWrds();
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
                        const compItems= {comp:c.compItem,quantity:c.quantity,isAuctionable:c.isAuctionable}
                        items.comps.push(compItems);
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
        if (this.state.schKyWrds.length < 5){
            //search top 8 matched result
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
                    url: `/api/professions/${this.state.schType}/part/${this.state.schKyWrds}`,
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
                            const curItems = this.getPageItems(itemAry,1);
                            this.setState({
                                items:itemAry,
                                currentItems:curItems
                            });      
                        }else{
                            const curItems = this.getPageItems([{name:"No Result"}],1);
                            this.setState({
                                items:[{name:"No Result"}],
                                currentItems:curItems
                            });
                        }
                    }
                });
            }
        }else{
            // search all results
            this.getAllItems();
        }
    }

    getAllItems(){
        clearTimeout(typingTimer);
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
                        const curItems = this.getPageItems(itemAry,1);  //get result item for first page
                        this.setState({
                            items:itemAry,
                            currentItems:curItems
                        });
                    }else{
                        const curItems = this.getPageItems([{name:"No Result"}],1);
                        this.setState({
                            items:[{name:"No Result"}],
                            currentItems:curItems
                        });
                    }
                }
            });
        }
    }

    getPageItems(items,pg){

        const pgItemNum = 8; //8 item for each result page

        const curItems = items.slice(pg * pgItemNum - pgItemNum,pg * pgItemNum);

        return update(this.state.currentItems,{$set:{pageNum:pg,items:curItems}});
    }

    clearKyWrds(){
        this.setState({
            schKyWrds:"",
            hasError:false,
            errorMsg:"",
            items:[],
            currentItems:{pageNum:1,items:[]}
        });
    }

    switchResultPg(pg){
        const nextItems = this.getPageItems(this.state.items,pg);
        this.setState({currentItems:nextItems});
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
                        <ProfList profs={ this.state.schType } selectType={ prof => this.selectType(prof) } />
                    </div>
                    
                    <input className='form-control' type='text' value={ this.state.schKyWrds } onChange={ e=> this.kyWrdChange(e) } placeholder='Enter Item Name'/>
                    <div className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={ this.getAllItems }><i className="glyphicon glyphicon-search"></i></button>
                        {this.state.schKyWrds != "" && <button className="btn btn-default" type="button" onClick={ () => this.clearKyWrds() } ><i className="glyphicon glyphicon-remove"></i></button>}
                    </div>

                </div>
                
                {this.state.hasError && <div className='alert alert-danger'>{this.state.errorMsg}</div>}
                <ul className='nav nav-second-level' style={searchStyle}>
                    {this.state.currentItems.items.map(item => {
                        if (item.name != "No Result" && item.name != "Loading"){
                            //display results from returned item list
                            const selectItem = this.selectItem.bind(this,item);
                            return(<a key={item.item} className='list-group-item list-group-item-action' href='javascript:void(0)' onClick={ selectItem }>
                                        <img src={ `http://media.blizzard.com/wow/icons/56/${item.icon}.jpg` } width='20' />
                                        <span className='pull-right h5' style={resultTxtStyle}>{ item.name }</span>
                                    </a>
                                )
                            
                        }else if (item.name =='Loading'){
                            //display Loading
                            return(<a key={item.name} className='list-group-item list-group-item-action' href='javascript:void(0)'>
                                        <span className='fa fa-circle-o-notch fa-spin' />
                                        <span className='pull-right'>{ item.name }</span>
                                    </a>
                                )
                        }   
                        //display no result
                        return(<a key={item.name} className='list-group-item list-group-item-action' href='javascript:void(0)'>
                                    <span className="glyphicon glyphicon-question-sign" />
                                    <span className='pull-right'>{ item.name }</span>
                                </a>
                            )                             
                    })
                    }

                    {this.state.items.length > 8 &&
                        //display only 8 results for each page
                        <div className='list-group-item list-group-item-action'>
                            <ul className="pagination" style={ {margin:0} }>
                                {  this.state.currentItems.pageNum != 1 && 
                                    <li>
                                        <a href="javascript:void(0)" aria-label="Previous" onClick={ () => this.switchResultPg(this.state.currentItems.pageNum - 1) } >
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                }

                                <li>
                                    <span aria-hidden="true">{ 
                                        (this.state.currentItems.pageNum * 8 - 7).toString() + " - " + (this.state.items.length - ((this.state.currentItems.pageNum - 1)* 8) > 8 ? (this.state.currentItems.pageNum * 8) : (this.state.currentItems.pageNum * 8 - 8) + this.state.items.length - (this.state.currentItems.pageNum -1) * 8   ).toString() + " of "  + this.state.items.length.toString()
                                    }</span>
                                </li>

                                { this.state.currentItems.pageNum * 8 < this.state.items.length && 
                                    <li>
                                        <a href="javascript:void(0)" aria-label="Next" onClick={ () => this.switchResultPg(this.state.currentItems.pageNum + 1) }>
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                }
                            </ul>
                        </div>
                    }
                </ul>
            </div>
        )
    }
}