import React from 'react'
import update from 'react-addons-update'

export default class extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mainComp:"",
            comps:[{comp:""},{comp:""},{comp:""}]
        }
    }

    addComp(){
        const newAry = update(this.state.comps,{$push:[{comp:""}]});
        console.log(newAry);
        this.setState({comps:newAry});
    }

    removeComp(){
        const newAry = this.state.comps.slice();
        newAry.pop();
        this.setState({comps:newAry});        
    }

    mainItemOnChange(e){
        this.setState({mainComp:e.target.value});
    }

    subItemOnChange(e){

    }

    render(){
        return (
            <div>
                <div className='row'>
                    <div className='col-md-7'>
                        <div className='input-group'>
                            <input className='form-control' placeholder='Main Item' onChange={ e=> this.mainItemOnChange(e) } required/>
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
                                    <div className='input-group'>
                                        <input className='form-control' placeholder='Item Comp' onChange={ e=> this.subItemOnChange(e) } required/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        )
    }

}