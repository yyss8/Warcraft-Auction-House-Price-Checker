import React from 'react';
import Search from "./components/searchbar.jsx";
import Price from "./components/priceview.jsx";
import update from "react-addons-update";
import { Link,browserHistory } from "react-router";
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const linksStyle = {
    borderColor:"#2e6da4",
    borderBottomColor:"transparent",
    backgroundColor:"#fff"
}

@connect(store =>{
    return {
        curPg:store.curPg
    }
})
export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            schFieldCls:"panel col-md-12",
            mainFieldCls:"col-md-offset-3 col-md-6",
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
    }

    openSetting(path){
        if (this.state.schFieldCls == "panel col-md-12"){
            this.setState({
                mainFieldCls:"col-md-offset-2 col-md-8",
                schFieldCls:"panel col-md-6"
            });
            setTimeout(()=>{
                this.setState({
                    settingField:!this.state.settingField
                })
                browserHistory.push(path);
            },500);
            
        }else{
            this.setState({
                mainFieldCls:"col-md-offset-3 col-md-6",
                schFieldCls:"panel col-md-12",
                settingField:!this.state.settingField
            });
            browserHistory.push('/');
        }

    }

    componentDidMount(){
        //redirect to control panel based on url
        
        if (this.props.location.pathname != "/"){
            this.setState({
                mainFieldCls:"col-md-offset-2 col-md-8",
                schFieldCls:"panel col-md-6",
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
                        <div className={this.state.schFieldCls} style={ {minWidth:330,minHeight:500,backgroundColor:"#D1D6F2"} }>
                            {/* pricing field */}
                            <br />
                            <Search />
                            <Price/>
                            <div className='row'>
                                <div className='col-md-offset-10 col-md-2'>
                                    <button className='pull-right btn btn-default fa fa-gear' onClick={ ()=>this.openSetting('/cp/add') }></button>
                                </div>
                            </div>
                            <br/>
                            
                        </div>

                        { //control panel field
                            this.state.settingField && 
                            <div className='col-md-6'style={ {minWidth:330,minHeight:250,backgroundColor:"#D1D6F2"} }>
                                <ReactCSSTransitionGroup transitionName="cp" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                                <br />
                                <ul className="nav nav-tabs" style={{borderBottomColor:"#2e6da4"}}>
                                    <li><Link to='/cp/add' activeClassName="active" activeStyle={ linksStyle }>New</Link></li>
                                    <li><Link to='/cp/modify' activeClassName="active" activeStyle={ linksStyle }>Modify</Link></li>
                                    <li><Link to='/cp/user' activeClassName="active" activeStyle={ linksStyle }>User</Link></li>
                                </ul>
                                <br />
                                {this.props.children}
                                </ReactCSSTransitionGroup>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}
