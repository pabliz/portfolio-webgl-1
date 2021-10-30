///////////////////////////////////////////////////////////////////////////////////////////////////
// WEBGL
///////////////////////////////////////////////////////////////////////////////////////////////////
import * as THREE from 'three';

import Scroll from "./scroll";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import FontFaceObserver from "fontfaceobserver";
import imagesLoaded from "imagesloaded";
import gsap from "gsap";
import waveyVertex from "../shader/waveyVertex.glsl";
import waveyFragment from "../shader/waveyFragment.glsl";
import distortVertex from "../shader/distortVertex.glsl";
import distortFragment from "../shader/distortFragment.glsl";

// POST-PROCESSING
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


export default class Canvas {
    constructor(options) {
            this.time = 0;
            this.container = options.dom;
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;

            this.scene = new THREE.Scene();

            this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 100, 2000);
            this.camera.position.z = 600;

            this.camera.fov = 2 * Math.atan((this.height / 2) / 600) * (180 / Math.PI);

            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });

            this.container.appendChild(this.renderer.domElement);

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);

            this.images = [...document.querySelectorAll('img')];

            this.videos = [...document.querySelectorAll('video')];

            //preload fonts
            const nmr = new Promise((resolve) => {
                new FontFaceObserver("Neue Montreal Regular").load().then(() => {
                    resolve();
                });
            });
            const nml = new Promise((resolve) => {
                new FontFaceObserver("Neue Montreal Light").load().then(() => {
                    resolve();
                });
            });
            const nmli = new Promise((resolve) => {
                new FontFaceObserver("Neue Montreal Light Italic").load().then(() => {
                    resolve();
                });
            });
            const nmb = new Promise((resolve) => {
                new FontFaceObserver("Neue Montreal Bold").load().then(() => {
                    resolve();
                });
            });
            // preload images
            const preloadImages = new Promise((resolve, reject) => {
                imagesLoaded(
                    document.querySelectorAll("img"), { background: true },
                    resolve
                );
            });
            let allDone = [nmr, nml, nmli, nmb, preloadImages];
            this.currentScroll = 0;
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();

            Promise.all(allDone).then(() => {
                this.scroll = new Scroll();
                this.addImages();
                this.addVideos();
                this.setImagesPosition();
                this.setVideosPosition();
                this.mouseMovement();
                this.resize();
                this.setupResize();
                this.composerPass();
                //this.addObjects();
                this.render();
            });
        }
        // post-processing
    composerPass() {
            this.composer = new EffectComposer(this.renderer);
            this.renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(this.renderPass);

            //custom shader pass
            var counter = 0.0;
            this.myEffect = {
                uniforms: {
                    "tDiffuse": { value: null },
                    "scrollSpeed": { value: null },
                    "uTime": { value: 0 }
                },
                vertexShader: distortVertex,
                fragmentShader: distortFragment,
            }

            this.customPass = new ShaderPass(this.myEffect);
            this.customPass.renderToScreen = true;

            this.composer.addPass(this.customPass);
        }
        // to draw webgl effects
    mouseMovement() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / this.width) * 2 - 1;
            this.mouse.y = -(e.clientY / this.height) * 2 + 1;
            // update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera(this.mouse, this.camera);

            // calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0) {
                let obj = intersects[0].object;
                obj.material.uniforms.uHover.value = intersects[0].uv;
            }
        }, false);
    }
    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }
    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }
    setVideosPosition() {
        this.videoStore.forEach(o => {
            o.mesh.position.y = this.currentScroll - o.top + this.height / 2 - o.height / 2;
            o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
        })
    }
    setImagesPosition() {
        this.imageStore.forEach(o => {
            o.mesh.position.y = this.currentScroll - o.top + this.height / 2 - o.height / 2;
            o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
        })
    }
    addVideos() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: 0 },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: waveyFragment,
            vertexShader: waveyVertex,
            //wireframe: true,
        });
        this.materials = [];

        this.videoStore = this.videos.map(video => {
            let bounds = video.getBoundingClientRect();
            let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 20, 20);
            let texture = new THREE.VideoTexture(video);
            texture.needsUpdate = true;
            let material = this.material.clone();

            video.addEventListener('mouseenter', () => {
                gsap.to(material.uniforms.uHoverState, {
                    duration: 1,
                    value: 1,
                })
            })
            video.addEventListener('mouseout', () => {
                gsap.to(material.uniforms.uHoverState, {
                    duration: 1,
                    value: 0,
                })
            })




            this.materials.push(material);
            material.uniforms.uImage.value = texture;
            let mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);


            return {
                video: video,
                mesh: mesh,
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height,
            }
        })
    }
    addImages() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: 0 },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: waveyFragment,
            vertexShader: waveyVertex,
            //wireframe: true,
        });

        this.materials = [];

        this.imageStore = this.images.map(img => {
            let bounds = img.getBoundingClientRect();
            let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 20, 20);
            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            let material = this.material.clone();

            img.addEventListener('mouseenter', () => {
                gsap.to(material.uniforms.uHoverState, {
                    duration: 1,
                    value: 1,
                })
            })
            img.addEventListener('mouseout', () => {
                gsap.to(material.uniforms.uHoverState, {
                    duration: 1,
                    value: 0,
                })
            })




            this.materials.push(material);
            material.uniforms.uImage.value = texture;
            let mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);


            return {
                img: img,
                mesh: mesh,
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height,
            }
        })
    }
    addObjects() {
        this.geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: waveyFragment,
            vertexShader: waveyVertex,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }
    render() {
        this.time += 0.5;
        //console.log(this.time);
        this.scroll.render();
        this.currentScroll = this.scroll.scrollToRender;
        this.setImagesPosition();
        this.setVideosPosition();
        this.customPass.uniforms.scrollSpeed.value = this.scroll.speedTarget;

        this.materials.forEach(m => {
                m.uniforms.uTime.value = this.time;
            })
            /////////////////////////////////////////////////////////////////
            // WAVEY
            /////////////////////////////////////////////////////////////////
        this.renderer.render(this.scene, this.camera);

        /////////////////////////////////////////////////////////////////
        // POST-PROCESSING
        /////////////////////////////////////////////////////////////////
        this.composer.render();

        window.requestAnimationFrame(this.render.bind(this));
    }
}