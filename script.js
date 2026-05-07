/* ================= SETUP ================= */

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext(
"2d",
{ alpha:true }
);

let w,h;

function resize(){

    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
}

resize();

const particles = [];

let started = false;

/* ================= MOUSE ================= */

const mouse = {

    x:-9999,
    y:-9999,
    radius:130
};

addEventListener("mousemove",e=>{

    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ================= PARTICLE ================= */

class Particle{

    constructor(x,y,color,size){

        this.baseX = x;
        this.baseY = y;

        this.x =
        Math.random() * w;

        this.y =
        Math.random() * h;

        this.color = color;
        this.size = size;

        this.density =
        Math.random() * 15 + 1;

        /* FIREFLY */

        this.phase =
        Math.random()
        * Math.PI * 2;

        this.speed =
        0.015
        + Math.random() * 0.02;

        this.glow =
        10 + Math.random() * 28;
    }

    update(){

        this.phase += this.speed;

        if(started){

            const dx =
            mouse.x - this.x;

            const dy =
            mouse.y - this.y;

            const dist =
            Math.hypot(dx,dy);

            if(dist < mouse.radius){

                const force =
                (mouse.radius - dist)
                / mouse.radius;

                this.x -=
                (dx / dist)
                * force
                * this.density;

                this.y -=
                (dy / dist)
                * force
                * this.density;

            }else{

                this.x +=
                (this.baseX - this.x)
                * .07;

                this.y +=
                (this.baseY - this.y)
                * .07;
            }

        }else{

            this.y += .15;

            if(this.y > h){

                this.y = -5;
                this.x = Math.random() * w;
            }
        }

        this.draw();
    }

    draw(){

        const flicker =
        (Math.sin(this.phase)+1)/2;

        const alpha =
        .2 + flicker * .8;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
        this.color;

        ctx.shadowColor =
        this.color;

        ctx.shadowBlur =
        2 + flicker * this.glow;

        ctx.globalAlpha =
        alpha;

        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

/* ================= HEART ================= */

function heart(t){

    return{

        x:
        16 * Math.sin(t) ** 3,

        y:
        13 * Math.cos(t)
        - 5 * Math.cos(2*t)
        - 2 * Math.cos(3*t)
        - Math.cos(4*t)
    };
}

function createHeart(){

    particles.length = 0;

    const scale = 26;

    for(
        let t=0;
        t<Math.PI*2;
        t+=0.015
    ){

        const p = heart(t);

        particles.push(

            new Particle(

                w/2 + p.x * scale,

                h/2 - p.y * scale,

                "#ff4fd8",

                2.4
            )
        );
    }

    createText();
}

/* ================= TEXT ================= */

function createText(){

    const temp =
    document.createElement("canvas");

    temp.width = w;
    temp.height = h;

    const tctx =
    temp.getContext("2d");

    tctx.fillStyle =
    "#fff";

    tctx.textAlign =
    "center";

    tctx.font =
    "bold 56px Arial";

    tctx.fillText(
        "Sería un gusto",
        w/2,
        h/2 - 10
    );

    tctx.fillText(
        "poder conocerte ✨",
        w/2,
        h/2 + 55
    );

    const {
        data,
        width,
        height
    } =
    tctx.getImageData(0,0,w,h);

    for(let y=0;y<height;y+=4){

        for(let x=0;x<width;x+=4){

            if(
                data[
                (y * width + x)
                * 4 + 3
                ] > 128
            ){

                particles.push(

                    new Particle(
                        x,
                        y,
                        "#fff",
                        1.9
                    )
                );
            }
        }
    }
}

/* ================= STARS ================= */

function createStars(){

    particles.length = 0;

    for(let i=0;i<550;i++){

        particles.push(

            new Particle(

                Math.random() * w,

                Math.random() * h,

                "#fff",

                Math.random() * 1.3
            )
        );
    }
}

/* ================= ANIMATION ================= */

function animate(){

    ctx.clearRect(0,0,w,h);

    for(let i=0;i<particles.length;i++){

        particles[i].update();
    }

    requestAnimationFrame(
        animate
    );
}

animate();

createStars();

/* ================= START ================= */

document
.getElementById("playBtn")
.addEventListener("click",()=>{

    started = true;

    document
    .getElementById("playBtn")
    .remove();

    createHeart();
});

/* ================= RESIZE ================= */

addEventListener("resize",()=>{

    resize();

    if(!started){

        createStars();

    }else{

        createHeart();
    }
});