import React from 'react';
import './Map.css';
import {Vertex} from './data/vertex';
import {DASH_HEIGHT} from './App';

const SCALE_FACTOR = 1.2;
const AUTOSCROLL_PADDING = 30;
const PATH_COLOR = 'yellow';
const STEP_COLOR = 'red';
const PATH_LINE_WIDTH = 5;
const LADDER_ANIME_MSEC = 200;
const LINE_ANIME_MSEC = 50;


export default class Map extends React.Component {
    state = {
        dashDisplay: 'inline',
        helpDisplay: 'none',
        mapDisplay: 'block',
        scrollBoxHeight: `${window.innerHeight - DASH_HEIGHT - 2}px`
    };


    constructor(props) {
        super(props);
        this.scrollBoxRef = React.createRef();
        this.canvasRef = React.createRef();

        this.scale = 1;
        this.pathFld = [];
        this.stepIdx = 0;
        this.floorIdx = 1 ;


    }



    render() {
        const imgList = [2,3,4,5,6].map(n =>
            <img id={'floor'+n} src={'floors/'+n+'.svg'} hidden key={n.toString()}/> );

        return (
            <div>
                <div id="scrollBox" ref={this.scrollBoxRef} style={ {height: this.state.scrollBoxHeight, display: this.props.visible} } >
                    <canvas ref={this.canvasRef}
                            onTouchStart={this.handleStart.bind(this)}
                            onTouchMove={this.handleMove.bind(this)}></canvas>
                </div>
                <img id='floor1' src={'floors/1.svg'} onLoad={this.init} hidden key='1'/>
                {imgList}
            </div>
        );
    }

    init = () => {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = document.getElementById("floor" + i);
            this.bgImages.push(im);
        }
        this.redraw();

    }


    // ============================ Touch Event Handlers ==============================

    handleStart(e) {
        //e.preventDefault();
        if (e.touches.length === 1) {
            this.xt = e.touches[0].clientX;
            this.yt = e.touches[0].clientY;
        }  else if (e.touches.length > 1) {
            this.xt = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
            this.yt = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
        }
    }

    handleMove(e) {
        //e.preventDefault();
        let xt;
        let yt;
        if (e.touches.length === 1) {
            xt = e.touches[0].clientX;
            yt = e.touches[0].clientY;
            this.scrollBoxRef.current.scrollLeft += this.xt - xt;
            this.scrollBoxRef.current.scrollTop += this.yt - yt;
        } else if (e.touches.length > 1) {
            xt = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
            yt = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
            let k = this.xt < xt || this.yt < yt ? SCALE_FACTOR : 1 / SCALE_FACTOR;
            // this.changeScale(k);
        }
        this.xt = xt;
        this.yt = yt;
    }

    // ============================ Drawing =====================================
    redraw() {
        const img = this.bgImages[0]; //// this.currentFloorImage;
        const canvas = this.canvasRef.current;
        // scale canvas
        canvas.width = img.width * this.scale;
        canvas.height = img.height * this.scale;
        this.ctx = canvas.getContext("2d");

        // draw image
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, canvas.width, canvas.height);

        // may be draw path
        if (!this.path.length) {
            return;
        }
        // this.drawPath();
    }

    // ============================ Properties =====================================

    set path(arr) {
        this.pathFld = arr;
        this.stepIdx = 0;
        this.floorIdx = this.pathFld[0].z;
        this.redraw();
    }

    get path() {
        return this.pathFld;
    }

    get currentFloorImage() {
        return this.bgImages[this.floorIdx];
    }

}

