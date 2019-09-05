import React from 'react';
import './App.css';
import Menu from './Menu';
import Map from './Map';
import {GuiderService} from './data/service';

export const DASH_HEIGHT = 50;
const SCALE_FACTOR = 1.2;

export default class App extends React.Component {

    state = {
        dashDisplay: 'inline',
        helpDisplay: 'none',
        mapDisplay: 'block'
    };

    constructor(props) {
        super(props);
        this.guiderService = new GuiderService();
        this.mapRef = React.createRef();

        this.fromTag = null;
        this.fromList = this.guiderService.getFromTags();
        this.toTag = null;
        this.toList = this.guiderService.getToTags();
    }

    render() {
        return (
            <div className="dash">
                <span style={ {display: this.state.dashDisplay}}>
                    <Menu name='From' list={this.fromList} onSelect={this.from}/>
                    <Menu name='To' list={this.toList} onSelect={this.to}/>

                    <button onClick={this.go}>Go</button>

                    <button onClick={this.incScale} className="more">+</button>
                    <button onClick={this.decScale} className="less">-</button>
                </span>

                <button onClick={this.help}>Help</button>

                <Map visible={this.state.mapDisplay} ref={this.mapRef} />

                <div id="help" style={ {display: this.state.helpDisplay}}>
                    <h2>Інструкція</h2>
                    <div id="guider">
                    Кнопкою <b>From</b> виберіть "звідки". <br/>
                    Кнопкою <b>To</b> виберіть "куди".<br/>
                    Тисніть на кнопку <b>Go</b> і йдіть.
                    </div>
                    <h3>Щасливої дороги!</h3>

                    <div  id="legend-cont">
                        <div id="legend">
                            Жовтий - ще непройденний шлях.<br/>
                            Червоний - вже пройдений шлях.<br/>
                            Суцільний - шлях на поточному поверсі.<br/>
                            Пунктир - шлях на інших поверхах.<br/>
                            Go без вибору - перегляд поверхів.
                        </div>
                    </div>
                    <div id="authors">
                        Будемо вдячні за <a href="http://tss.co.ua:5555/Twit">відгуки та пропозиції</a>
                        <br/><br/>
                        Георгій Світенко, Ігор Цой, гр.ПЗПІ-18-1<br/>
                        Кафедра програмної інженерії<br/>
                        2019

                    </div>
                </div>
            </div>
        );
    }


    from = (tag) => {
        this.fromTag = tag;
        this.createRoute();
        this.mapDisplay = 'block';
    };

    to = (tag) => {
        this.toTag = tag;
        this.createRoute();
        this.mapDisplay = 'block';
    };

    go = () => {
        const map = this.mapRef.current;
        if (map.path.length > 0) {
            map.step();
        } else {
            map.showNextLevel();
        }
    };

    incScale = () => {
        this.mapRef.current.changeScale(SCALE_FACTOR);
    };

    decScale = () => {
        this.mapRef.current.changeScale(1 / SCALE_FACTOR);
    };

    createRoute() {
        const map = this.mapRef.current;
        let path = this.guiderService.findPath(this.fromTag, this.toTag);
        if (path && path.length) {
            map.path = path;
            setTimeout(() => {
                map.autoscroll(map.path[0])
            }, 0)
        } else {
            map.path = [];
            console.log(`cannot find path ${this.fromTag} -- ${this.toTag}`)
        }
    }



    help = () => {
        if (this.state.mapDisplay === 'none') {
            this.setState({mapDisplay: 'block', helpDisplay: 'none', dashDisplay: 'inline'});
        } else {
            this.setState({mapDisplay: 'none', helpDisplay: 'block', dashDisplay: 'none'});
        }
    }

}

