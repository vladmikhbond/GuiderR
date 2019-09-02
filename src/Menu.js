import React from 'react';
import './Menu.css';
import Submenu from './Submenu';
import {DASH_HEIGHT} from './App';


/*
    from props:
        name, menuSet, onSelect
*/

export default class Menu extends React.Component {
    state = {
        menuClass: 'hidden',
        menuHeight: `${window.innerHeight - DASH_HEIGHT - 2}px`,
        tag: this.props.name,

        openSubTitle: null
    };

    render() {
        const subMenus = Object.keys(this.props.menuSet).map(title =>
            <Submenu
                title={title}
                items={this.props.menuSet[title]}
                isOpen={title === this.state.openSubTitle}

                titleClick={this.titleClick}
                itemClick={this.itemClick}

                key={title}
        />);


        return (
            <React.Fragment>
                <button className="menu" onClick={this.menuClick}>{this.state.tag}</button>
                <ul className={this.state.menuClass}
                    style={{ height: this.state.menuHeight, left: this.props.name === 'To' ? '50px' : '0' }}>

                    {subMenus}

                </ul>
            </React.Fragment>
         );
    }

    itemClick = ({ target: { textContent : name }}) => {
        this.menuClick();
        const tag = name;
        this.setState({tag: tag.slice(0, 7)});
        this.props.onSelect(tag);
    };

    titleClick = ({ target: { name } }) => {
        const openSubTitle = (this.state.openSubTitle === name) ? null : name;
        this.setState({ openSubTitle });
    };

    menuClick = () => {
        if (this.state.menuClass === 'hidden') {
            this.setState({ menuClass: 'visible' });
        } else {
            this.setState({ menuClass: 'hidden' , openSubTitle: null});
        }
    };
}

