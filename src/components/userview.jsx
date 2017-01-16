import React from 'react'
import { connect } from 'react-redux'

@connect(store =>{
    return {
        login:store.login
    }
})
export default class extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            password:"",
            isLoading:false,
            loadingCls:"fa fa-circle-o-notch fa-spin",
            hasError:false,
            errorMsg:""
        }
    }

    passWordOnChange(e){
        this.setState({
            password:e.target.value
        });
    }

    userNameOnChange(e){
        this.setState({
            username:e.target.value
        });
    }

    componentDidMount(){
        $.get(`/user/data/${this.props.login}`,r =>{
            console.log(r);
            const password = r.result.A_Password === undefined ? "":r.result.A_Password;
            this.setState({
                password
            });
        });
    }

    saveChanges(){
        const data = {username:this.props.login,password:this.state.password};
        this.setState({
            isLoading:true
        });
        $.ajax({
            url: `/user/${this.props.login}/edit`,
            type:'PUT',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: (result)=>{
                if (result.status == "ok"){
                    this.setState({
                        loadingCls:"fa fa-check"
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
    }

    render(){
        return (
            <div>
                <br /><br />
                <div className='row'>
                    <div className='col-md-offset-3 col-md-6'>
                        <label>Username: <input className='form-control' value= { this.props.login } onChange={ e => this.userNameOnChange(e) } /></label>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-offset-3 col-md-6'>
                        <label>Password: <input className='form-control' value={ this.state.password } onChange={ e => this.passWordOnChange(e) }/></label>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-offset-3 col-md-6'>
                        <button className='btn btn-default' onClick={ () => this.saveChanges() }>Save</button>
                        { this.state.isLoading && 
                            <i className={ this.state.loadingCls } style={{marginTop:10,marginLeft:5}}></i>
                        }
                    </div>
                </div>
            </div>
        )
    }
}