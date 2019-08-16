import React from 'react';
import './App.css';
import Menu from './Menu';
import Map from './Map';

export default class App extends React.Component {
    state = {dashDisplay: 'inline', helpDisplay: 'none', mapDisplay: 'block'};

    render() {
        return (
            <div className="dash">
                <span style={ {display: this.state.dashDisplay}}>
                <Menu name='From' />
                <button>Output</button>

                <button onClick={this.go}>Go</button>

                <button onClick={() => this.changeScale(true)} className="more">+</button>
                <button onClick={() => this.changeScale(false)} className="more">-</button>
              </span>
              <button onClick={this.help}>Help</button>

              {/*<Map style={ {display: this.state.mapDisplay}}></Map>*/}
                <Map visible={this.state.mapDisplay}></Map>


              <div id="help" style={ {display: this.state.helpDisplay}}>
                    <h1>Инструкция</h1>
                    <p/>Первой кнопкой выберите "откуда".
                    <p/>Второй кнопкой выберите "куда".
                    <p/>Жмите на кнопку Go и идите.
                    <h2>Счастливого пути!</h2>
                    <div id="legend">
                        <h3>Легенда</h3>
                        Желтый - непройденный путь<br/>
                        Красный - пройденный путь<br/>
                        Сплошной - путь на видимом этаже<br/>
                        Пунктир - путь на невидимых этажах<br/>
                    </div>
                    <hr/>
                    <p/>Рекомендуемый мобильный браузер - Chrome.
               </div>
            </div>
        );
    }

    help = () => {
        if (this.state.mapDisplay === 'none') {
            this.setState({mapDisplay: 'block', helpDisplay: 'none', dashDisplay: 'inline'});
        } else {
            this.setState({mapDisplay: 'none', helpDisplay: 'block', dashDisplay: 'none'});
        }
    }

}

