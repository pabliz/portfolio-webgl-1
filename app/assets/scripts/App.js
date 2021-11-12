import "../styles/styles.css";

import Canvas from './modules/Canvas';
import SwapSpan from "./modules/SwapSpan";

import gsap from "gsap";



if (module.hot) {
    module.hot.accept();
}
new Canvas({
    dom: document.getElementById('container')
});
// PRELOADER

const preloader = document.querySelector(".preloader");
const main = document.querySelector("main");

window.addEventListener("load", () => {

    gsap.to(preloader, {
        delay: 2,
        duration: .1,
        autoAlpha: 0
    })
    gsap.from(main, {
        background: "#17191C",
        delay: 1,
        duration: .3,
    })
})

// CURSOR
const animateit = function(e) {
    const span = this.querySelector('span');
    const { offsetX: x, offsetY: y } = e, { offsetWidth: width, offsetHeight: height } = this,

    move = 8,
        xMove = x / width * (move * 2) + move,
        yMove = y / height * (move * 2) - move;

    span.style.transform = `translate(${xMove}px, ${yMove}px)`;

    if (e.type === 'mouseleave') span.style.transform = '';
};


const link = document.querySelector('.hover-this');
const cursor = document.querySelector(".cursor")
const editCursor = e => {
    const { clientX: x, clientY: y } = e;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
};

link.addEventListener('mousemove', animateit);
link.addEventListener('mouseleave', animateit);
window.addEventListener('mousemove', editCursor);

// document.addEventListener('mousemove', (e) => {
//     gsap.to(cursor, {
//         x: (-e.pageX),
//         height: e.pageY,
//     })
// })

// document.addEventListener("dblclick", () => {
//         cursor.classList.toggle("hidden");
//     })
// SWAPSPAN
new SwapSpan();