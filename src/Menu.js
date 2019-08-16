import React from 'react';
import './Menu.css';


export default class Menu extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    state = {itemsClass: 'hidden'}

    render() {
        const items = ["111", "222", "333"].map(x => <li key={x}>{x}</li>)
        return (
            <React.Fragment>
                <button onClick={this.buttonClick}>{this.props.name}</button>
                <ul className={this.state.itemsClass}>
                    {items}
                </ul>
            </React.Fragment>


         );
    }

    buttonClick = () => {
        if (this.state.itemsClass === 'hidden') {
            this.setState({itemsClass: 'visible'});
        } else {
            this.setState({itemsClass: 'hidden'});
        }
    }

}

