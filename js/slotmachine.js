/*jslint browser: true*/
/*global THREE, Stats*/

/*
---------------------------------------------------------------------------

VIRTUAL SLOT MACHINE
====================

Written By Kevin Ellis August 2015.

A simple 3D "Slot Machine" game.
This game uses the excellent three.js WebGL library and was mainly written
as a learning exercise for three.js and JavaScript techniques. As a result
my code may not be the most robust or eloquent, but it might be of some use
to others starting out with 3D browser programming.

---------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2015 Kevin Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---------------------------------------------------------------------------
*/

function virtualSlotMachine() {
  'use strict';

  var WHEEL_SEGMENT = Math.PI / 4;
  var gameState = 0; //0 Waiting, 1 Spinning, 2 Won, 3 Lost

  function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    return stats;
  }

  var stats = initStats();

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xB8EDFF, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMapEnabled = true;
  // create the ground plane
  var planeGeometry = new THREE.PlaneBufferGeometry(150, 150);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xBBFF00
  });

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = -15;
  plane.position.z = 0;
  // add the plane to the scene
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.x = 25;
  camera.position.y = 10;
  camera.position.z = 60;
  camera.lookAt(scene.position);

  //Add an ambient light
  var ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(20, 50, 100);
  spotLight.castShadow = true;
  scene.add(spotLight);

  //Load Wheel
  var wheels = [];
  var wheelTexture, wheelMaterial, loader;
  wheelTexture = THREE.ImageUtils.loadTexture("images/wheel.png");
  wheelTexture.minFilter = THREE.NearestFilter;
  wheelMaterial = new THREE.MeshPhongMaterial({
    ambient: 0x999999,
    color: 0xffffff,
    specular: 0x333333,
    shininess: 8,
    shading: THREE.SmoothShading,
    map: wheelTexture
  });

  // instantiate a loader
  loader = new THREE.JSONLoader();
  // load a resource
  loader.load(
    // resource URL
    'js/wheel.js',
    // Function when resource is loaded
    function (geometry) {
      var ix = 0;
      for (ix = 0; ix < 3; ix += 1) {
        wheels[ix] = new THREE.Mesh(geometry, wheelMaterial);
        wheels[ix].scale.x = 10;
        wheels[ix].scale.y = 10;
        wheels[ix].scale.z = 10;
        wheels[ix].position.x = (ix * 10) - 10;
        wheels[ix].castShadow = true;
        scene.add(wheels[ix]);
        wheels[ix].XXsegment = 0; //Custom variable added to THREE object
        wheels[ix].XXposition = 0; //Custom variable added to THREE object
        wheels[ix].XXspinUntil = 0; //Custom variable added to THREE object
        wheels[ix].XXstopSegment = 0; //Custom variable added to THREE object
      }
    }
  );

  //Add the linebars
  var linebarGeometery = new THREE.CylinderGeometry(0.5, 0.5, 30, 16);
  var linebarMaterial = new THREE.MeshLambertMaterial({
    color: 0xff000
  });

  //bottom linebar
  var linebar1 = new THREE.Mesh(linebarGeometery, linebarMaterial);
  linebar1.rotation.z = -0.5 * Math.PI;
  linebar1.position.z = 9.2;
  linebar1.position.y = -5;
  linebar1.castShadow = true;
  scene.add(linebar1);

  //Top linebar
  var linebar2 = new THREE.Mesh(linebarGeometery, linebarMaterial);
  linebar2.rotation.z = -0.5 * Math.PI;
  linebar2.position.z = 9.2;
  linebar2.position.y = 5;
  linebar2.castShadow = true;
  scene.add(linebar2);

  var orbitControls = new THREE.OrbitControls(camera);
  orbitControls.rotateSpeed = 1.0;
  orbitControls.zoomSpeed = 1.0;
  orbitControls.panSpeed = 1.0;
  orbitControls.noPan = true;
  orbitControls.maxPolarAngle = Math.PI / 2;
  orbitControls.minAzimuthAngle = -Math.PI / 2;
  orbitControls.maxAzimuthAngle = Math.PI / 2;
  orbitControls.minDistance = 25;
  orbitControls.maxDistance = 100;

  //TEMP Keyboard handler
  window.addEventListener("keydown", function (event) {
    if (event.keyCode === 65) {
      gameState = (gameState + 1) % 2;
    }
  }, false);

  function RNG() {
    //Random Number Generator
    var wheelNumbers = [];
    RNG.prototype.generate = function () {
      //This function constantly generates random numbers for each wheel
      var ix = 0;
      for (ix = 0; ix < 3; ix += 1) {
        wheelNumbers[ix] = Math.floor(Math.random() * 8); //TODO use bigger number and get to numbers for % payout
      }
    };
    RNG.prototype.getNumber = function (ix) {
      //Return a number for the selected wheel
      return wheelNumbers[ix];
    };
  }

  // add the output of the renderer to the html element
  document.body.appendChild(renderer.domElement);
  //document.getElementById("WebGL-output").appendChild(renderer.domElement);
  // call the render function
  //renderer.render(scene, camera);

  var rng = new RNG();
  var clock = new THREE.Clock();

  function renderScene() {
    stats.update();
    var delta = clock.getDelta();
    orbitControls.update(delta);

    //Ensure the wheel model is valid (i.e. loaded).
    var check = typeof wheels[2];
    if (check !== 'undefined') {
      var ix;
      switch (gameState) {
      case 0: //Waiting for play to hit start
        for (ix = 0; ix < 3; ix += 1) {
          wheels[ix].rotation.x = (wheels[ix].XXsegment * WHEEL_SEGMENT) - 0.20;
        }
        break;

      case 1: //Capture RNG values for each wheel and set up the wheel spins.
        for (ix = 0; ix < 3; ix += 1) {
          wheels[ix].XXspinUntil = (clock.getElapsedTime() + (ix * 2)) + 3; //xx seconds per wheel
          wheels[ix].XXstopSegment = rng.getNumber(ix);
        }
        gameState = 2;
        break;

      case 2: //Spin those wheels!
        for (ix = 0; ix < 3; ix += 1) {
          if (wheels[ix].XXsegment === wheels[ix].XXstopSegment && wheels[ix].XXspinUntil < clock.getElapsedTime()) {
            //This wheel has stoped spinning. Align wheel
            //gameState = 3;
            wheels[ix].rotation.x = (wheels[ix].XXsegment * WHEEL_SEGMENT) - 0.20;
          } else {
            //Spin until wheel spinning time is exceeded and the wheel has landed on the chosen segment
            wheels[ix].XXposition += 3 * delta;
            while (wheels[ix].XXposition > (Math.PI * 2)) {
              wheels[ix].XXposition -= Math.PI * 2;
            }
            wheels[ix].rotation.x = wheels[ix].XXposition - 0.20;
            wheels[ix].XXsegment = Math.floor(wheels[ix].XXposition / WHEEL_SEGMENT);
          }
        }
        break;

      case 3: //Spinning stopped
        break;

      case 4: //Player has won!
        break;
      } //end switch gameState
    } //end Model valid (i.e. loaded)

    rng.generate(); //Cnstantly generate a random stop postition for each wheel.

    window.requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  renderScene();
} //end virtualSlotMachine

window.onload = virtualSlotMachine;