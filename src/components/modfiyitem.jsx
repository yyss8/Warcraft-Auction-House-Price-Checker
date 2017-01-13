import React from 'react'
import update from 'react-addons-update'
import ProfList from './minorcomponents/professionselect.jsx';

const schTypes = ["ID","Name"]

export default class extends React.Component{
    constructor (props) {
        super(props)
        this.state = {
            profs:"Professions",
            schType:"ID",
            schKyWrds:"",
            mainItem:"",
            enName:"",
            cnName:"",
            icon:"",
            quantity:1,
            comps:[],
            hasError:false,
            errorMsg:""
        };
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
        
    }

    search(){
        $.get(`/api/professions/${this.state.profs}/${this.state.schKyWrds}`, r => {
            if (r.status == "ok"){
                this.setState({
                    mainItem:r.result.item,
                    icon:r.result.icon,
                    quantity:r.result.quantity,
                    comps:r.result.comp ,
                    enName:r.result.enName,
                    cnName:r.result.cnName
                });
            }else{
                this.setState({
                    hasError:true,
                    errorMsg:r.content
                })
            }
        });
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

    subItemOnChange(e,index){
        let newAry = [...this.state.item.comps];
        const newObj = update(this.state.comps[index],{$set:{comp:e.target.value,quantity:this.state.comps[index].quantity}});
        newAry[index] = newObj;
        this.setState({
            comps:newAry,
            hasError:false,
            errorMsg:""
        });
    }

    subItemQtOnChange(e,index){
        let newAry = [...this.state.item.comps];
        const newObj = update(this.state.comps[index],{$set:{comp:this.state.comps[index].comp,quantity:Number(e.target.value)}});
        newAry[index] = newObj;
        this.setState({comps:newAry});
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

    }

    clearItem(){

    }

    render(){
        return (
            <div>
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
                            </div>
                        </div>  
                    </div>
                </div>
                <br />
                <div className='row'>
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
                    <div className='col-md-6'>
                        <input className='form-control' placeholder='Item Name' onChange={ e=> this.enNameOnChange(e) } required value={ this.state.enName }/>
                    </div>
                    <div className= 'col-md-6'>
                        <input className='form-control' placeholder='物品名' onChange={ e=> this.cnNameOnChange(e) } required value={ this.state.cnName } />
                    </div>
                </div>

                <br />

                <div className='row'>
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
                                <button className="btn btn-default glyphicon glyphicon-repeat"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <h5><strong>Comp Infos</strong></h5>

                {
                    this.state.comps.map((comp,index)=>{
                        return(
                            <div key={index}>

                                <div className='row'>
                                    <div className='col-md-2'>
                                        {this.state.comps[index].icon != "" &&
                                            <img src={ `http://media.blizzard.com/wow/icons/56/${ this.state.comps[index].icon }.jpg` } height='40px' width='40px' />
                                        }
                                    </div>
                                    <div className='col-md-7'>
                                        <input className='form-control' placeholder='Item Name' onChange={ e=> this.itemIconOnChange(e) } required value={ this.state.comps[index].enName }/>
                                    </div>
                                    <div className='col-md-2'>
                                        <label style={{marginTop:5}}>AH &nbsp;<input type='checkbox' checked={ this.state.comps[index].isAuctionable } /></label>
                                    </div>
                                </div>

                                <div  className='row' style={{marginTop:10}}>
                                    <div  className='col-md-4'> 
                                        <input className='form-control' placeholder='Comp ID' onChange={ (e)=> this.subItemOnChange(e,index) } required value={ this.state.comps[index].compItem }/>
                                    </div>
                                    <div className= 'col-md-2'>
                                        <input className='form-control' placeholder='Qt' value={ this.state.comps[index].quantity } onChange={ (e)=> this.subItemQtOnChange(e,index) } required/>
                                    </div>
                                    <div className= 'col-md-6'>
                                        <input className='form-control' placeholder='Comp Name' value={ this.state.comps[index].icon } onChange={ (e)=> this.subItemQtOnChange(e,index) } required/>
                                    </div>
                                </div>
                                <br/>
                            </div>
                        )
                    })
                }


                {this.state.mainItem != "" && 
            
                    <div className='col-md-offset-7 col-md-5'>
                        <div className='input-group'>
                            <div className='input-group-btn pull-right'>
                                <button className="btn btn-default glyphicon glyphicon-floppy-disk" onClick={ () => this.saveItem() }></button>
                                <button className="btn btn-default glyphicon glyphicon-trash" onClick={ this.clearItem }></button>
                            </div>
                        </div>
                        <br />
                    </div>
                }

            </div>
        )
    }
}