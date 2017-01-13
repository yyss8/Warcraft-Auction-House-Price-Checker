import React from 'react'
import update from 'react-addons-update'
import ProfList from './minorcomponents/professionselect.jsx';

function formValid(callback){
    let hasError = true;
    let errMsg = ""
    $("#addItemForm :input[required]:visible").each(function(){
        if ($(this).val() == ""){
            $(this).focus();
            hasError = false;
            errMsg = "Missing Item Infos";
            return false
        }else if (isNaN($(this).val())){
            $(this).focus();
            hasError = false;
            errMsg = "Item Info Must Be A Number"
            return false
        }
    });
    callback({isValid:hasError,content:errMsg});
}

export default class extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mainItem:"",
            mainQt:1,
            comps:[{comp:"",quantity:1},{comp:"",quantity:1},{comp:"",quantity:1}],
            profs:"Professions",
            isLoading:false,
            loadingCls:"fa fa-circle-o-notch fa-spin",
            hasError:false,
            errorMsg:""
        }

        this.clearItem = this.clearItem.bind(this);
        this.saveItem = this.saveItem.bind(this);
    }

    addComp(){
        const newAry = update(this.state.comps,{$push:[{comp:"",quantity:1}]});
        this.setState({comps:newAry});
    }

    removeComp(){
        let newAry = [...this.state.comps];
        newAry.pop();
        this.setState({comps:newAry});        
    }

    mainItemOnChange(e){
        this.setState({
            mainItem:e.target.value,
            hasError:false,
            errorMsg:"",
        });
    }

    mainItemQtOnchange(e){
        this.setState({mainQt:e.target.value});
    }

    subItemOnChange(e,index){
        let newAry = [...this.state.comps];
        const newObj = update(this.state.comps[index],{$set:{comp:e.target.value,quantity:this.state.comps[index].quantity}});
        newAry[index] = newObj;
        this.setState({
            comps:newAry,
            hasError:false,
            errorMsg:""
        });
    }

    subItemQtOnChange(e,index){
        let newAry = [...this.state.comps];
        const newObj = update(this.state.comps[index],{$set:{comp:this.state.comps[index].comp,quantity:Number(e.target.value)}});
        newAry[index] = newObj;
        this.setState({comps:newAry});
    }

    clearItem(){
        this.setState({
            hasError:false,
            errorMsg:"",
            mainItem:"",
            mainQt:1,
            comps:[{comp:"",quantity:1},{comp:"",quantity:1},{comp:"",quantity:1}],
            profs:"Professions"
        })
    }

    selectType(prof){
        this.setState({
            profs:prof,
            hasError:false,
            errorMsg:"",
        });
    }

    saveItem(){
        if (this.state.profs == "Professions"){
            this.setState({
                hasError:true,
                errorMsg:"Select A Profession"                
            })
        }else{
            formValid(validation => {
                //check all inputs are filled
                if (validation.isValid){
                    this.setState({
                        isLoading:true,
                        hasError:false,
                        errorMsg:""
                    });
                    let itemPkg = {main:this.state.mainItem,quantity:this.state.mainQt,comps:this.state.comps};
                    $.ajax({
                        url: `/api/professions/${this.state.profs}/${this.state.mainItem}/add`,
                        type:'POST',
                        contentType: "application/json",
                        data: JSON.stringify(itemPkg),
                        success: (result)=>{
                            if (result.status == "ok"){
                                this.setState({
                                    loadingCls:"fa fa-check"
                                })
                            }else{
                                this.setState({
                                    hasError:true,
                                    loadingCls:"fa fa-ban",
                                    errorMsg:`Error Happened with Item: ${result.item}`
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
            })
        }

    }

    render(){
        return (
            <div id='addItemForm'>
                <div className='row'>
                    <div className='col-md-5'>
                        <ProfList profs={ this.state.profs } selectType={ prof => this.selectType(prof) } />
                    </div>
                </div>

                <br />
                <div className='row'>
                    <div className='col-md-5'>
                        <input className='form-control' placeholder='Main Item' onChange={ e=> this.mainItemOnChange(e) } required value={ this.state.mainItem }/>
                    </div>
                    <div className= 'col-md-2'>
                        <input className='form-control' placeholder='Qt' onChange={ e=> this.mainItemQtOnchange(e) } required value={ this.state.mainQt } />
                    </div>

                    <div className= 'col-md-5'>
                        <div className='input-group'>
                            <div className='input-group-btn'>
                                <button className="btn btn-default glyphicon glyphicon-plus" onClick={ () => this.addComp() }></button>
                                <button className="btn btn-default glyphicon glyphicon-minus" onClick={ () => this.removeComp() }></button>
                            </div>
                        </div>
                    </div>
                    
                </div>
                {
                    this.state.comps.map((comp,index)=>{
                        return(
                            <div key={index} className='row' style={{marginTop:5}}>
                                <div  className='col-md-5'> 
                                    <input className='form-control' placeholder='Item Comp' onChange={ (e)=> this.subItemOnChange(e,index) } required value={ this.state.comps[index].comp }/>
                                </div>
                                <div className= 'col-md-2'>
                                    <input className='form-control' placeholder='Qt' value={ comp.quantity } onChange={ (e)=> this.subItemQtOnChange(e,index) } required/>
                                </div>
                            </div>
                        )
                    })
                }
                <br />
                <div className='row'>
                    <div className='col-md-2'>
                    { this.state.isLoading && 
                        <i className={ this.state.loadingCls } style={{marginTop:10,marginLeft:5}}></i>
                    }
                    </div>
                    <div className='col-md-offset-3 col-md-5'>
                        <div className='input-group'>
                            <div className='input-group-btn'>
                                <button className="btn btn-default glyphicon glyphicon-floppy-disk" onClick={ () => this.saveItem() }></button>
                                <button className="btn btn-default glyphicon glyphicon-trash" onClick={ this.clearItem }></button>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
                {this.state.hasError && <div className='alert alert-danger'>{this.state.errorMsg}</div>}
            </div>
        )
    }

}