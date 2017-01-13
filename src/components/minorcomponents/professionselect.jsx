import React from 'react';

const professions = ["Alchemy","Blacksmithing","Cooking","Enchanting","Engineering","First Aid","Inscription","Jewelcrafting","Leatherworking","Tailoring"];

export default class extends React.Component{
    constructor(props){
        super(props)
    }

    selectType(prof){
        this.props.selectType(prof);
    }

    render(){
        return (
            <div className="dropdown">
                <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.profs}&nbsp;
                    <span className="caret"></span>    
                </button>
                <ul className="dropdown-menu">
                    {professions.map(prof => {
                        const selectType = this.selectType.bind(this,prof);
                        return (<li key={prof}><a href='javascript:void(0)' onClick= { selectType  }>&nbsp; {prof}</a></li>)
                    })}
                </ul>
            </div>
        )
    }
}

