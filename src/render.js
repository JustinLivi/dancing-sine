'use strict';

const raf = require( 'raf' );

module.exports = function createSketch( canvas ) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext( '2d' );
    const fps = 40;
    const fpsInterval = 1000 / fps;
    const s = height / 3;

    let stopped = false;
    let max;
    let now;
    let elapsed;
    let then = window.performance.now();
    let x1;
    let y1;
    let x2;
    let y2;
    let theta;
    let speed;
    let count;
    let delta = 0.1;

    ctx.strokeStyle = 'black';

    function random( low, high ) {
        return ( high - low ) * Math.random() + low;
    }

    function radians( degrees ) {
        return ( Math.PI * degrees ) / 180;
    }

    function line( lx1, ly1, lx2, ly2 ) {
        ctx.beginPath();
        ctx.moveTo( lx1, ly1 + height / 2 );
        ctx.lineTo( lx2, ly2 + height / 2 );
        ctx.stroke();
        ctx.closePath();
    }

    function randomize() {
        ctx.clearRect( 0, 0, width, height );
        speed = random( 5, 50 );
        count = random( 360, 720 );
    }

    function reset( percent ) {
        theta = -100;
        count += delta * percent;
        if ( count > 718.7 ) {
            count = 718.7;
            delta *= -1;
        }
        else if ( count < 360 ) {
            count = 360;
            delta *= -1;
        }
        y2 = Math.pow( Math.sin( theta ), 3 );
        x2 = Math.pow( Math.sin( theta ), 2 ) * Math.cos( theta );
        if ( y2 < 0 ) {
            x2 *= -1;
        }
        x2 += theta / speed;
        x1 = x2;
        y1 = y2;
    }

    function generate() {
        theta += radians( count );
        x1 = x2;
        y1 = y2;
        y2 = Math.pow( Math.sin( theta ), 3 );
        x2 = Math.pow( Math.sin( theta ), 2 ) * Math.cos( theta );
        if ( y2 < 0 ) {
            x2 *= -1;
        }
        x2 += theta / speed;
        ctx.lineWidth = Math.abs( 5 * y2 ) + 1;
        line( s * x1, s * y1, s * x2, s * y2 );
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.ellipse( s * x2, s * y2 + height / 2, Math.abs( 5 * y2 ) + 1, Math.abs( 5 * y2 ) + 1, 0, 0, 2 * Math.PI );
        ctx.fill();
    }

    function draw( percent ) {
        reset( percent );
        max = width / s + 100;
        ctx.fillStyle = `rgba(256, 256, 256, ${percent * Math.ceil( speed ) / 256})`;
        ctx.fillRect( 0, 0, width, height );
        ctx.beginPath();
        while ( x2 < max ) {
            generate();
        }
    }

    function animate() {
        if ( stopped ) return;
        raf( animate );
        now = window.performance.now();
        elapsed = now - then;

        if ( elapsed > 2000 ) {
            then = now - ( elapsed % fpsInterval );
            randomize();
        }
        else if ( elapsed > fpsInterval ) {
            then = now - ( elapsed % fpsInterval );
            draw( 1 + ( elapsed - fpsInterval ) / fpsInterval );
        }
    }

    canvas.addEventListener( 'click', randomize );

    randomize();
    animate();

    return {
        stop: function stop() {
            stopped = true;
        },
    };
};
