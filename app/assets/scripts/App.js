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
// const cursor = document.querySelector(".cursor")

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