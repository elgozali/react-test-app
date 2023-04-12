import React from 'react';
import './Header.scss';
import { withRouter } from 'react-router-dom';
import { getUser, removeUserSession } from '../Utils/Common';

class AppHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfoLoaded: getUser() ? true : false,
        }
    }

    // handle logout event
    handleLogout = () => {
        removeUserSession();
        this.props.history.push("/login");
        window.location.reload();
    }

    render() {
        return (
            <div className='header'>
                <div className="nav-container">
                    <div className="logo">
                        <span>React Test App</span>
                    </div>
                    {this.state.userInfoLoaded &&
                        <nav>
                            <ul className="nav-list">
                                <li>
                                    <button className='logout-btn' onClick={this.handleLogout}>Logout &nbsp;<i className="fa fa-sign-out-alt"></i></button>
                                </li>
                            </ul>
                        </nav>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(AppHeader);