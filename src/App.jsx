import React from 'react';
import Search from "./components/searchbar.jsx";
import Price from "./components/priceview.jsx";
import AddItem from "./components/additem.jsx";
import update from "react-addons-update";


export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            schFieldCls:"panel col-md-12",
            mainFieldCls:"col-md-offset-4 col-md-4",
            priceFormStyle:{
                backgroundColor:"#D1D6F2",
                minHeight:300,
                borderRadius:15,
                minWidth:330,
                WebkitTransition:"width 0.5s",
                transition: "width 0.5s"
            },
            settingField:false
        };

        this.openSetting = this.openSetting.bind(this);
    }

    openSetting(){
        if (this.state.schFieldCls == "panel col-md-12"){
            this.setState({
                mainFieldCls:"col-md-offset-3 col-md-6",
                schFieldCls:"panel col-md-6"
            });

            setTimeout(()=>{
                this.setState({
                    settingField:!this.state.settingField
                })
            },500);
            
        }else{
            this.setState({
                mainFieldCls:"col-md-offset-4 col-md-4",
                schFieldCls:"panel col-md-12",
                settingField:!this.state.settingField
            });        
        }

    }

    render() {
        return (
            <div>
            <br />
                <div className='row'>
                    <div className={this.state.mainFieldCls} style={ this.state.priceFormStyle }>
                        <div className={this.state.schFieldCls} style={ {minWidth:330,minHeight:300,backgroundColor:"#D1D6F2"} }>
                            <br />
                            <Search />
                            <Price/>
                            <button className='pull-right btn btn-default fa fa-gear' onClick={ this.openSetting }></button>
                        </div>
                        { this.state.settingField && 
                            <div className='col-md-6'style={ {minWidth:330,minHeight:300,backgroundColor:"#D1D6F2"} }>
                                <br />
                                <ul className="nav nav-tabs" style={{borderBottomColor:"#2e6da4"}}>
                                    <li role="presentation" className='active'><a href='javascript:void(0)' style={{borderColor:"#2e6da4",borderBottomColor:"transparent"}}>New</a></li>
                                    <li><a href='javascript:void(0)'>Modify</a></li>
                                    <li><a href='javascript:void(0)'>User</a></li>
                                </ul>
                                <br />
                                <AddItem/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}
