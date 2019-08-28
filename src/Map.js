import React from 'react';
import './Map.css';
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
        this.floorIdx = 0;

    }

    render() {
        return (
            <div>
                <div id="scrollBox" ref={this.scrollBoxRef} style={ {height: this.state.scrollBoxHeight, display: this.props.visible} } >
                    <canvas ref={this.canvasRef}
                            onTouchStart={this.handleStart.bind(this)}
                            onTouchMove={this.handleMove.bind(this)}></canvas>
                </div>
                <img id='floor1' alt='' src={'floors/1.svg'} onLoad={this.init} hidden key='1'/>
                <img id='floor2' alt='' src={'floors/2.svg'} hidden key='2'/>
                <img id='floor3' alt='' src={'floors/3.svg'} hidden key='3'/>
                <img id='floor4' alt='' src={'floors/4.svg'} hidden key='4'/>
                <img id='floor5' alt='' src={'floors/5.svg'} hidden key='5'/>
                <img id='floor6' alt='' src={'floors/6.svg'} hidden key='6'/>
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

    };


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
            this.changeScale(k);
        }
        this.xt = xt;
        this.yt = yt;
    }

    // ============================ Drawing =====================================
    redraw() {
        const img = this.currentFloorImage;
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
        this.drawPath();
    }

    drawPath() {
        const k = this.scale;
        const path = this.path;
        const ctx = this.ctx;
        const idx = this.stepIdx;
        ctx.lineWidth = PATH_LINE_WIDTH;

        ctx.lineCap = "round";
        // draw unvisible yellow path
        ctx.setLineDash([0, 10]);
        const onOtherFloorsBeforeIdx = path.filter((v, i) => v.z !== this.floorIdx && i <= idx);
        partOfPath(onOtherFloorsBeforeIdx, STEP_COLOR);

        // draw unvisible red path
        const onOtherFloorsAfterIdx = path.filter((v, i) => v.z !== this.floorIdx && i >= idx);
        partOfPath(onOtherFloorsAfterIdx, PATH_COLOR);

        // draw visible yellow path
        ctx.setLineDash([]);
        const onThisFloorBeforeIdx = [];
        for (let i = idx; i >= 0 && path[i].z === path[idx].z ; i--) {
            onThisFloorBeforeIdx.unshift(path[i]);
        }
        partOfPath(onThisFloorBeforeIdx, STEP_COLOR);

        // draw visible red path
        const onThisFloorAfterIdx = [];
        for (let i = idx; i < path.length && path[i].z === path[idx].z ; i++) {
            onThisFloorAfterIdx.push(path[i]);
        }
        partOfPath(onThisFloorAfterIdx, PATH_COLOR);

        drawStartPoint();

        // local
        function partOfPath(part, color) {
            ctx.beginPath();
            for (let i = 0; i < part.length - 1; i++) {
                ctx.moveTo(part[i].x * k, part[i].y * k);
                ctx.lineTo(part[i+1].x * k, part[i+1].y * k);
            }
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        function drawStartPoint() {
            let start = path[0];
            circle(PATH_LINE_WIDTH, STEP_COLOR);
            circle(PATH_LINE_WIDTH / 2, PATH_COLOR);

            // local
            function circle(r, color) {
                ctx.beginPath();
                ctx.arc(start.x * k, start.y * k, r, 0, Math.PI * 2, true);
                ctx.fillStyle = color;
                ctx.fill();

            }
        }
    }

    drawStep() {
        const k = this.scale;
        const path = this.path;
        const i = this.stepIdx;
        const ctx = this.ctx;
        ctx.strokeStyle = STEP_COLOR;
        ctx.lineCap = "round";
        const upDown = path[i+1].z - path[i].z;
        const me = this;

        if (upDown) {
            ladderAnime(path[i].x * k, path[i].y * k);
        } else {
            lineAnime(path[i].x * k, path[i].y * k, path[i + 1].x * k, path[i + 1].y * k);
        }

        // local: ctx, k, upDown, me
        function ladderAnime(x, y) {
            ctx.fillStyle = STEP_COLOR;
            const n = 4, h = 3, w = 5 * h, d = 10;
            let i = 0;
            const t = setInterval(function() {
                ctx.fillRect(x - w / 2, y - i * d * upDown, w, h);
                if (i === n) {
                    clearInterval(t);
                    me.redraw();
                }
                i++;
            }, LADDER_ANIME_MSEC);

        }

        // local: ctx, me
        function lineAnime(xFrom, yFrom, xTo, yTo) {
            ctx.lineWidth = PATH_LINE_WIDTH;
            let n = 3;
            const dx = (xTo - xFrom) / n;
            const dy = (yTo - yFrom) / n;
            let x = xFrom;
            let y = yFrom;
            // let animIdx = 0;

            const t = setInterval(function() {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + dx, y + dy);
                ctx.stroke();
                x += dx;
                y += dy;
                // the anime shot is last
                if (n === 1) {
                    clearInterval(t);
                    // if the next step is short do it now
                    let v = path[i + 1], u = path[i + 2];
                    if (i < path.length - 2 && v.distTo(u) < DASH_HEIGHT && v.z === u.z) {
                        me.step();
                    }
                    // the step is last
                    if (i === path.length - 2) {
                        setTimeout(drawGoal, LADDER_ANIME_MSEC);
                    }
                }
                n--;
            }, LINE_ANIME_MSEC);
        }

        // local: i, path, ctx, k, upDown
        function drawGoal() {
            let target = path[i + 1];
            circle(3 * 4, PATH_COLOR);
            circle(3 * 3, STEP_COLOR);
            circle(3 * 2, PATH_COLOR);
            circle(3, STEP_COLOR);
            // local
            function circle(r, color) {
                ctx.beginPath();
                ctx.arc(target.x * k, target.y * k, r, 0, Math.PI * 2, true);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

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

    // ===================================================================

    step() {
        if (this.stepIdx === this.path.length - 1) {
            this.stepIdx = 0;
            this.floorIdx = this.path[this.stepIdx + 1].z;
            this.redraw();
        } else {
            // show floor image
            this.floorIdx = this.path[this.stepIdx + 1].z;
            this.drawStep();
            this.stepIdx++;
        }

        // autoscroll
        let steoTarget = this.path[this.stepIdx];
        this.autoscroll(steoTarget);
    }

    changeScale(k) {
        // center is a fixed point
        const box = this.scrollBoxRef.current;
        const w = box.clientWidth / 2;
        const h = (box.clientHeight) / 2;
        box.scrollLeft = (box.scrollLeft + w) * k - w;
        box.scrollTop = (box.scrollTop + h) * k - h;

        this.scale *= k;
        this.redraw();
    }

    autoscroll(target) {
        const k = this.scale;
        const box = this.scrollBoxRef.current;
        // to right
        if ( target.x * k > box.scrollLeft + box.clientWidth) {
            let d = target.x * k - (box.scrollLeft + box.clientWidth);
            box.scrollLeft += d + AUTOSCROLL_PADDING;
        }
        // to left
        if ( target.x * k < box.scrollLeft) {
            let d = box.scrollLeft - target.x * k;
            box.scrollLeft -= d + AUTOSCROLL_PADDING;
        }
        // to down
        if ( target.y * k > box.scrollTop + box.clientHeight) {
            let d = target.y * k - (box.scrollTop + box.clientHeight);
            box.scrollTop += d + AUTOSCROLL_PADDING;
        }

        // to down
        if ( target.y * k > box.scrollTop + box.clientHeight) {
            let d = target.y * k - (box.scrollTop + box.clientHeight);
            box.scrollTop += d + AUTOSCROLL_PADDING;
        }
        // to up
        if ( target.y * k < box.scrollTop) {
            let d = box.scrollTop - target.y * k;
            box.scrollTop -= d + AUTOSCROLL_PADDING;
        }

    }

}

