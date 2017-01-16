import React from 'react'
import { connect } from 'react-redux'
import { login } from "../actions/login";
import { browserHistory } from 'react-router'

@connect(store =>{
    return {
        login:store.login
    }
})
export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            result:"",
            username:"",
            password:"",
            hasError:false,
            hasMsg:false
        };
    }

    userNameOnChange(e){
        this.setState({
            hasError:false,
            result:"",
            username:e.target.value
        });
    }

    passWordOnChange(e){
        this.setState({
            hasError:false,
            result:"",
            password:e.target.value
        });
    }

    login(){
        if (this.state.username == ""){
            this.setState({
                hasError:true,
                result:"Enter Password"
            });
        }else if (this.state.password == ""){
            this.setState({
                hasError:true,
                result:"Enter Username"
            });
        }else{
            $.get(`/user/login?username=${this.state.username}&password=${this.state.password}` , r => {
                if (r.status != "ok"){
                    this.setState({
                        hasError:true,
                        result:r.content
                    });
                }else{
                    this.setState({
                        hasMsg:true,
                        result:r.content
                    });
                    this.props.dispatch(login(r.user));
                    browserHistory.push('/cp/add');
                }
            });
        }
    }

    componentDidMount () {
        if (this.props.login != "None"){
            browserHistory.push('/cp/add');
        }
    }

    render(){
        return (
            <div className="col-md-offset-1 col-md-10">
                <br /><br /><br /><br />
                <div className="col-md-offset-2 col-md-8">
                    <form id="login">
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-user fa-fw" aria-hidden="true"></i></span>
                                <input type="text"  placeholder='ID' onChange={ e => this.userNameOnChange(e) } required className="form-control mainInput" />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-key fa-fw" aria-hidden="true"></i></span>
                                <input type="password" placeholder='password' onChange={ e => this.passWordOnChange(e) } required className="form-control mainInput" />
                            </div>
                        </div>
                        
                    </form>
                    <button type="button" className="btn btn-primary" style={ {width:"100%"}} onClick={ () => this.login() }>Login</button>
                    <br /><br />
                    {this.state.hasError &&
                        <p className="alert alert-danger">
                            <i className="fa  fa-exclamation fa-fw" aria-hidden="true"></i>
                        { this.state.result }</p>
                    }
                    {this.state.hasMsg &&
                        <p className="alert alert-success">
                            <i className="fa  fa-check fa-fw" aria-hidden="true"></i>
                        { this.state.result }</p>
                    }
                </div>
            </div>
        )
    }
}