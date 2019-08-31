import React from 'react';
import './Submenu.css';

/*
    from props: 
        title, items, isOpen, titleClick, itemClick
*/

export default class Submenu extends React.Component {

    render() {
        const items = this.props.items
            .map(item =>
                <li
                    onClick={this.props.itemClick}
                    key={item}>
                    {item}
                </li>);

        return (
            <React.Fragment>
                <button
                    onClick={this.props.titleClick}
                    name={this.props.title}
                    className={'submenu_btn'}
                >
                    {this.props.title}
                </button>

                <ul 
                    className={'submenu_ul'}
                    style={{ 'display': this.props.isOpen ? 'block' : 'none' }}>
                    {items}
                </ul>
            </React.Fragment>
        );
    }
}


