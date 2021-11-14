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
const link = document.querySelector('.hover-this');
const cursor = document.querySelector(".cursor")
const img = document.querySelectorAll("img")

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



////////////////////////////////////////////////////////
// CURSOR
// const animateit = function(e) {
//     const span = this.querySelector('span');
//     const { offsetX: x, offsetY: y } = e, { offsetWidth: width, offsetHeight: height } = this,

//     move = 8,
//         xMove = x / width * (move * 2) + move,
//         yMove = y / height * (move * 2) - move;

//     span.style.transform = `translate(${xMove}px, ${yMove}px)`;

//     if (e.type === 'mouseleave') span.style.transform = '';
// };



// const editCursor = e => {
//     const { clientX: x, clientY: y } = e;
//     cursor.style.left = x + 'px';
//     cursor.style.top = y + 'px';
// };

// const cursorHide = (e) => {
//     cursor.style.visibility = 'hidden'
//     if (e.type === 'mouseleave') cursor.style.visibility = 'visible';
// }

// link.addEventListener('mousemove', animateit);
// link.addEventListener('mouseleave', animateit);
// window.addEventListener('mousemove', editCursor);
// img.forEach(el => {
//     el.addEventListener('mousemove', cursorHide)
//     el.addEventListener('mouseleave', cursorHide)
// })
/////////////////////////////////////////////////////
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

const accordionTabs = document.querySelectorAll(".accordion__button")
let accordionContent = document.querySelectorAll(".accordion__content")

const closeAccordionTabs = () => {
    accordionContent.forEach(content => {
        content.classList.remove("isActive")
    })
    accordionTabs.forEach(button => {
        button.classList.remove("accordion__button--active")
    })
}

accordionTabs.forEach(button => {
    const thisContent = button.nextElementSibling;
    button.addEventListener("click", () => {
        if (button.classList.contains('accordion__button--active')) {
            closeAccordionTabs()
        } else {
            closeAccordionTabs()
            button.classList.add('accordion__button--active')
            thisContent.classList.add("isActive")
        }
    })
})



window.addEventListener("scroll", closeAccordionTabs)

const text = document.querySelector('.circular__text')
text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>")
const element = document.querySelectorAll('.circular__text span')
for (let i = 0; i < element.length; i++) {
    element[i].style.transform = "rotate(" + i * 13.6 + "deg)"
}