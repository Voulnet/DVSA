import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Icon, Label, Menu, Segment} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import SideBar from './SideBar';
import AuthButton from './AuthButton';
import * as API from '../utils/apiCaller';
import SearchInput from './SearchInput';
import {fixProductsData} from '../selectors/product';

export class Header extends Component {

    constructor(props){
        super(props);
        this.onClickLogout   = this.onClickLogout.bind(this);
        this.state = {inbox: false};
        this.ajaxCall = this.ajaxCall.bind(this);
     }


    onClickLogout() {
        localStorage.clear();
        var port = window.location.port;
        if (port == "") {
            port = "80"
        }
        window.location.replace("//" + window.document.domain + ":" + port);
    }

    ajaxCall(){
        let self = this;
        let opts = {
                    'action': 'inbox'
        };
        API.callApi(opts)
        .then(function(response) {
                return response.json();
            }).then(function(err, data) {
                if(data) {
                    if ( data.status == "ok" && data.messages.length > 0) {
                        self.setState ({ inbox: true });
                    }
                    else {
                        self.setState ({ inbox: false });
                    }
                }
                else {
                    if (err.status == "ok" && err.messages.length > 0) {
                        self.setState ({ inbox: true });
                    }
                    else {
                        self.setState ({ inbox: false });
                    }
                }
           });
    }

    componentWillMount() {
        setInterval(this.ajaxCall, 10000);

    }

    render() {
        const inboxicon = this.state.inbox? 'https://i.imgur.com/YHJEIjH.png': '/images/iconinbox.png'
        return (
            <Segment inverted>
                <Menu inverted fixed='top' size='large'>
                    <Menu.Item>
                        <SideBar/>
                    </Menu.Item>
                    <div className='search-input'>
                        <SearchInput products={fixProductsData(this.props.products)}/>
                    </div>
                    <Menu.Item>
                        <img width="128px" src="https://i.imgur.com/NZWCtGA.png"/>
                        <h3>DVSA - Damn Vulnerable Serverless Application</h3>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Link to='/cart'>
                                <Icon className='cursor' size='large' name='shop'/>
                            </Link>
                            {this.props.cartLength > 0 &&
                            <Label size='mini' color='red'>{this.props.cartLength}</Label>}
                        </Menu.Item>

                         <Menu.Item name='inbox'>
                            <Link to='/inbox'>
                            <a><img src={inboxicon} width="28px"/></a>
                            </Link>
                         </Menu.Item>

                        <Menu.Item>
                            <a onClick={this.onClickLogout} href="#"><img src='https://i.imgur.com/kYgKJMH.png' width="24px"/></a>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Segment>
        );
    }
}

const mapStateToProps = (state) => ({
    cartLength: state.shoppingCart.length,
    products: state.products
});

export default connect(mapStateToProps)(Header);
