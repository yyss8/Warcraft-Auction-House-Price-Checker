import React from 'react'
import update from 'react-addons-update'
import ProfList from './minorcomponents/professionselect.jsx';

const schTypes = ["ID","Name"]
const resultTxtStyle = {margin:"3px 0 0 0"};
const searchStyle = {
    overflowY:"auto",
    maxHeight:400
}

function formValid(callback){
    let hasError = true;
    let errMsg = ""
    $("#modifyItemForm :input[required]:visible").each(function(){
        if ($(this).val() == ""){
            $(this).focus();
            hasError = false;
            errMsg = "Missing Item Infos";
            return false
        }
    });
    callback({isValid:hasError,content:errMsg});
}

function form(){
    $("#modifyItemForm :input[required]:visible").each(function(){
        console.log($(this).val());
    });
}

export default class extends React.Component{
    constructor (props) {
        super(props)
        this.state = {
            profs:"Professions",
            schType:"ID",
            schKyWrds:"",
            schResult:[],
            itemID:"",
            mainItem:"",
            enName:"",
            cnName:"",
            icon:"",
            quantity:1,
            originComp:{},
            comps:[],
            isLoading:false,
            loadingCls:"fa fa-circle-o-notch fa-spin",
            hasError:false,
            errorMsg:"",
            searchResult:[],
            currentResult:{
                pageNum:1,
                items:[]
            },
            showResult:true
        };

        this.schByID = this.schByID.bind(this);
        this.schByKyWrds = this.schByKyWrds.bind(this);
        this.getPageItems = this.getPageItems.bind(this);
        this.switchResultPg = this.switchResultPg.bind(this);
    }

    selectType (prof) {
        this.setState({
            profs:prof
        });
    }

    selectSchType (schType) {
        this.setState({
            schType
        })
    }

    kyWrdChange (e) {
        this.setState({
            schKyWrds:e.target.value,
            hasError:false,
            errorMsg:"",
        })
    }

    clearKyWrds () {
        this.setState({
            schKyWrds:"",
            hasError:false,
            errorMsg:"",
            searchResult:[],
            currentResult:{
                pageNum:1,
                items:[]
            }
        })
    }

    search(){
        if (this.state.profs == "Professions"){
            this.setState({
                hasError:true,
                errorMsg:"Select A Profession"                
            })
        }else if ( this.state.schKyWrds == "" ){
            this.setState({
                hasError:true,
                errorMsg:"Enter Search Keywords"                
            })
        }else if (this.state.schType == "ID"){
            this.schByID(this.state.schKyWrds);
        }else if (this.state.schType == "Name"){
            this.schByKyWrds();
        }

    }

    schByID(id){
        $.get(`/api/professions/${this.state.profs}/${id}`, r => {
            if (r.status == "ok"){
                this.setState({
                    originComp:r.result,
                    itemID:r.result._id,
                    mainItem:r.result.item,
                    icon:r.result.icon,
                    quantity:r.result.quantity === undefined || r.result.quantity === null ? 1:r.result.quantity, //prevent fetching undefined or null quantity
                    comps:r.result.comp ,
                    enName:r.result.enName,
                    cnName:r.result.cnName,
                    showResult:false
                });
            }else{
                this.setState({
                    hasError:true,
                    errorMsg:r.content,
                    showResult:false
                })
            }
        });
    }
    
    schByKyWrds(){
        $.get(`/api/professions/${this.state.profs}/all/${this.state.schKyWrds}` , r => {
            if (r.result.length != 0){
                let itemAry = []
                r.result.forEach((result) => {
                    let item = {item:result.item}
                    if (result.enName == undefined){
                        item["name"] = result.cnName;
                    }else{
                        item["name"] = result.enName;
                    }
                    itemAry.push(item);
                });
                const curItems = this.getPageItems(itemAry,1);  //get result item for first page
                this.setState({
                    showResult:true,
                    hasError:false,
                    errorMsg:"",
                    searchResult:itemAry,
                    currentResult:curItems
                });
            }else{
                const currentResult = this.getPageItems([{name:"No Result"}],1);
                this.setState({
                    items:[{name:"No Result"}],
                    currentResult:currentResult
                });
            }
        });
    }

    selectID(id){
        this.schByID(id);
    }

    getPageItems(items,pg){
        const pgItemNum = 8; //8 item for each result page

        const curItems = items.slice(pg * pgItemNum - pgItemNum,pg * pgItemNum);

        return update(this.state.currentResult,{$set:{pageNum:pg,items:curItems}});
    }

    switchResultPg(pg){
        const nextItems = this.getPageItems(this.state.searchResult,pg);
        this.setState({currentResult:nextItems});
    }

    mainItemOnChange(e){
        //prevent from entering non-number
        if (!isNaN(e.target.value)) {
            this.setState({
                mainItem:Number(e.target.value),
                hasError:false,
                errorMsg:"",
            });
        }
    }

    mainItemQtOnchange(e){
        if (!isNaN(e.target.value)) {
            this.setState({
                quantity:Number(e.target.value),
                hasError:false,
                errorMsg:"",
            });
        }
    }

    enNameOnChange(e){
        this.setState({
            enName:e.target.value,
            hasError:false,
            errorMsg:"",
        });
    }

    cnNameOnChange(e){
        this.setState({
            cnName:e.target.value,
            hasError:false,
            errorMsg:"",
        })
    }

    itemIconOnChange(e){
        this.setState({
            icon:e.target.value,
            hasError:false,
            errorMsg:"",
        })
    }

    subItemOnChange(e,index,field){
        let updateFields = ["compItem","icon","isAuctionable","enName","quantity"]; //fields needed to be copy
        let updateQuery = {};
        let update = true; 

        if (field == "compItem" && isNaN(e.target.value) || field == "quantity" && isNaN(e.target.value)){
            //prevent string input for compItem and quantity field
            update = false;
        }

        updateFields.splice(updateFields.indexOf(field),1); //remove field needed to be update with new value
        updateFields.forEach((field) => {
            updateQuery[field] = this.state.comps[index][field];
        });

        if (field != "isAuctionable"){
            updateQuery[field] = e.target.value;
        }else{
            updateQuery[field] = !this.state.comps[index][field];
        }

        let newAry = [...this.state.comps]; 
        newAry[index] = updateQuery;
        
        if (update){
            this.setState({
                comps:newAry,
                hasError:false,
                errorMsg:""
            });
        }
    }

    addComp(){
        const newAry = update(this.state.comps,{$push:[{compItem:"",icon:"",quantity:1,enName:"",isAuctionable:true}]});
        this.setState({comps:newAry});
    }

    removeComp(){
        let newAry = [...this.state.comps];
        newAry.pop();
        
        this.setState({comps:newAry});  
    }

    saveItem(){
        formValid(validation => {
            //check all inputs are filled
            if (validation.isValid){
                this.setState({
                    isLoading:true,
                    hasError:false,
                    errorMsg:""
                });
                const item = {
                    _id:this.state.itemID,
                    item:this.state.mainItem,
                    quantity:this.state.quantity,
                    cnName:this.state.cnName,
                    enName:this.state.enName,
                    icon:this.state.icon,
                    comp:this.state.comps
                }
                $.ajax({
                    url: `/api/professions/${this.state.profs}/${this.state.mainItem}/update`,
                    type:'PUT',
                    contentType: "application/json",
                    data: JSON.stringify(item),
                    success: (result)=>{
                        if (result.status == "ok"){
                            this.setState({
                                loadingCls:"fa fa-check",
                                originComp:item
                            })
                        }else{
                            this.setState({
                                hasError:true,
                                loadingCls:"fa fa-ban",
                                errorMsg:result.content
                            })
                        }
                        setTimeout(() =>{
                            this.setState({
                                loadingCls:"fa fa-circle-o-notch fa-spin",
                                isLoading:false
                            });
                        },3000)
                    }
                });
            }else{
                this.setState({
                    hasError:true,
                    errorMsg:validation.content
                })
            }
        });
    }

    clearItem(){
        this.setState({
            itemID:"",
            mainItem:"",
            enName:"",
            cnName:"",
            icon:"",
            quantity:1,
            originComp:{},
            comps:[],
            schKyWrds:"",
            hasError:false,
            errorMsg:""
        })
    }

    returnToOrigin(){
        this.setState({
            mainItem:this.state.originComp.item,
            icon:this.state.originComp.icon,
            quantity:this.state.originComp.quantity,
            comps:this.state.originComp.comp ,
            enName:this.state.originComp.enName,
            cnName:this.state.originComp.cnName
        });
    }

    showResult(){
        this.setState({
            showResult:true
        })
    }

    hideResult(){
        this.setState({
            showResult:false
        })
    }

    render(){
        return (
            <div id='modifyItemForm'>
                <div className='row'>
                    <div className='col-md-3'>
                        <ProfList profs={ this.state.profs } selectType={ prof => this.selectType(prof) } />
                    </div>

                    <div className='col-md-2'>
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                { this.state.schType }&nbsp;
                                <span className="caret"></span>    
                            </button>
                            <ul className="dropdown-menu">
                                {schTypes.map(t => {
                                    const selectSchType = this.selectSchType.bind(this,t);
                                    return (<li key={t}><a href='javascript:void(0)' onClick= { selectSchType  }>&nbsp; {t}</a></li>)
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className='col-md-7'>
                        <div className='input-group'>
                            <input className='form-control' type='text' value={ this.state.schKyWrds } onChange={ e => this.kyWrdChange(e) } placeholder='Item'/>
                            <div className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={ () => this.search() }><i className="glyphicon glyphicon-search"></i></button>
                                {this.state.schKyWrds != "" && <button className="btn btn-default" type="button" onClick={ () => this.clearKyWrds() } ><i className="glyphicon glyphicon-remove"></i></button>}
                                {this.state.searchResult.length != 0 && this.state.showResult === true && <button className="btn btn-default" type="button" onClick={ () => this.hideResult() } ><i className="glyphicon glyphicon-triangle-top"></i></button>}
                                {this.state.searchResult.length != 0 && this.state.showResult === false && <button className="btn btn-default" type="button" onClick={ () => this.showResult() } ><i className="glyphicon glyphicon-triangle-bottom"></i></button>}
                            </div>
                        </div> 
                    </div>
                </div>
                {this.state.searchResult.length != 0 && this.state.showResult === true &&
                    <ul className='nav nav-second-level' style={searchStyle}>
                        {this.state.currentResult.items.map(item => {
                            if (item.name != "No Result" && item.name != "Loading"){
                                //display results from returned item list
                                const selectID = this.selectID.bind(this,item.item);
                                return(<a key={item.item} className='list-group-item list-group-item-action' href='javascript:void(0)' onClick={ selectID }>
                                            <span className='h6' style={resultTxtStyle}>{ item.name }</span>
                                            <span className='h6 pull-right' style={resultTxtStyle}>{ item.item }</span>
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
                        {this.state.searchResult.length > 8 &&
                            //display only 8 results for each page
                            <div className='list-group-item list-group-item-action'>
                                <ul className="pagination" style={ {margin:0}}>
                                    {  this.state.currentResult.pageNum != 1 && 
                                        <li>
                                            <a href="javascript:void(0)" aria-label="Previous" onClick={ () => this.switchResultPg(this.state.currentResult.pageNum - 1) } >
                                                <span aria-hidden="true">&laquo;</span>
                                            </a>
                                        </li>
                                    }

                                    <li>
                                        <span aria-hidden="true">{ 
                                            (this.state.currentResult.pageNum * 8 - 7).toString() + " - " + (this.state.searchResult.length - ((this.state.currentResult.pageNum - 1)* 8) > 8 ? (this.state.currentResult.pageNum * 8) : (this.state.currentResult.pageNum * 8 - 8) + this.state.searchResult.length - (this.state.currentResult.pageNum -1) * 8   ).toString() + " of "  + this.state.searchResult.length.toString()
                                        }</span>
                                    </li>

                                    { this.state.currentResult.pageNum * 8 < this.state.searchResult.length && 
                                        <li>
                                            <a href="javascript:void(0)" aria-label="Next" onClick={ () => this.switchResultPg(this.state.currentResult.pageNum + 1) }>
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                    }
                                </ul>
                            </div>
                        }
                    </ul>
                }
                <br />
                {this.state.mainItem != "" && 
                    <div>
                        {/* Item Info Field */}
                        <div className='row'>
                            {/* main item icon */}
                            <div className='col-md-6'>
                                {this.state.icon != "" &&
                                    <img src={ `http://media.blizzard.com/wow/icons/56/${ this.state.icon }.jpg` } height='40px' width='40px' />
                                }
                                
                                <span className='h6'> &nbsp; { this.state.enName } </span>
                            </div>
                            <div className='col-md-6'>
                                <input className='form-control' placeholder='Item Icon' onChange={ e=> this.itemIconOnChange(e) } required value={ this.state.icon }/>
                            </div>
                        </div>

                        <br />

                        <div className='row'>
                            {/* main item name */}
                            <div className='col-md-6'>
                                <input className='form-control' placeholder='Item Name' onChange={ e=> this.enNameOnChange(e) } required value={ this.state.enName }/>
                            </div>
                            <div className= 'col-md-6'>
                                <input className='form-control' placeholder='物品名' onChange={ e=> this.cnNameOnChange(e) } value={ this.state.cnName } />
                            </div>
                        </div>

                        <br />

                        <div className='row'>
                            {/* main item id/quantity/isAuctionable */}
                            <div className='col-md-5'>
                                <input className='form-control' placeholder='Main Item' onChange={ e=> this.mainItemOnChange(e) } required value={ this.state.mainItem }/>
                            </div>
                            <div className= 'col-md-2'>
                                <input className='form-control' placeholder='Qt' onChange={ e=> this.mainItemQtOnchange(e) } required value={ this.state.quantity } />
                            </div>

                            <div className= 'col-md-5'>
                                <div className='input-group'>
                                    <div className='input-group-btn'>
                                        <button className="btn btn-default glyphicon glyphicon-plus" onClick={ () => this.addComp() }></button>
                                        <button className="btn btn-default glyphicon glyphicon-minus" onClick={ () => this.removeComp() }></button>
                                        <button className="btn btn-default glyphicon glyphicon-repeat" onClick={ () => this.returnToOrigin() } ></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <h5><strong>Comp Infos</strong></h5>

                        {
                            this.state.comps.map((comp,index)=>{
                                return(
                                    <div key={index}>

                                        <div className='row'>
                                            {/* comp item icon/name/isAuctionable */}
                                            <div className='col-md-2'>
                                                {this.state.comps[index].icon != "" &&
                                                    <img src={ `http://media.blizzard.com/wow/icons/56/${ this.state.comps[index].icon }.jpg` } height='40px' width='40px' />
                                                }
                                            </div>
                                            <div className='col-md-7'>
                                                <input className='form-control' placeholder='Item Name' onChange={ e=> this.subItemOnChange(e,index,"enName") } required value={ this.state.comps[index].enName }/>
                                            </div>
                                            <div className='col-md-2'>
                                                <label style={{marginTop:5}}>AH &nbsp;<input type='checkbox' checked={ this.state.comps[index].isAuctionable } onChange={ (e) => this.subItemOnChange(e,index,"isAuctionable") }/></label>
                                            </div>
                                        </div>

                                        <div  className='row' style={{marginTop:10}}>
                                            {/* comp item id/quantity/name */}
                                            <div  className='col-md-4'> 
                                                <input className='form-control' placeholder='Comp ID' onChange={ (e)=> this.subItemOnChange(e,index,"compItem") } required value={ this.state.comps[index].compItem }/>
                                            </div>
                                            <div className= 'col-md-2'>
                                                <input className='form-control' placeholder='Qt' value={ this.state.comps[index].quantity } onChange={ (e)=> this.subItemOnChange(e,index,"quantity") } required/>
                                            </div>
                                            <div className= 'col-md-6'>
                                                <input className='form-control' placeholder='Comp Name' value={ this.state.comps[index].icon } onChange={ (e)=> this.subItemOnChange(e,index,"icon") } required/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <br/> 
                                    </div>
                                )
                            })
                        }


                        {this.state.mainItem != "" && 
                            <div className='row'>
                               {/* result & save/remove buttons */}
                                <div className='col-md-2'>
                                { this.state.isLoading && 
                                    <i className={ this.state.loadingCls } style={{marginTop:10,marginLeft:5}}></i>
                                }
                                </div>
                                <div className='col-md-offset-5 col-md-5'>
                                    <div className='input-group'>
                                        <div className='input-group-btn pull-right'>
                                            <button className="btn btn-default glyphicon glyphicon-floppy-disk" onClick={ () => this.saveItem() }></button>
                                            <button className="btn btn-default glyphicon glyphicon-trash" onClick={ () => this.clearItem() }></button>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            </div>
                        }
                    </div>
                }
                
                {this.state.hasError && <div className='alert alert-danger'>{this.state.errorMsg}</div>}
            </div>
        )
    }
}