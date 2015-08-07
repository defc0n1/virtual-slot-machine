function virtualSlotMachine(){"use strict";function a(){var a=new Stats;return a.setMode(0),a.domElement.style.position="absolute",a.domElement.style.left="0px",a.domElement.style.top="0px",document.body.appendChild(a.domElement),a}function b(a){var b=new THREE.Vector3(a.clientX/window.innerWidth*2-1,2*-(a.clientY/window.innerHeight)+1,.5);b=b.unproject(n);var c=new THREE.Raycaster(n.position,b.sub(n.position).normalize()),d=c.intersectObjects([F]);1===d.length&&(F.position.y=-15,0===i&&(i=1))}function c(){F.position.y=-14}function d(){var a=[];d.prototype.generate=function(){var b=0;for(b=0;3>b;b+=1)a[b]=Math.floor(40*Math.random())},d.prototype.getNumber=function(b){return a[b]<=4?0:5===a[b]?1:6===a[b]?2:a[b]>=7&&a[b]<=17?3:18===a[b]?4:19===a[b]?5:a[b]>=20&&a[b]<=38?6:39===a[b]?7:void 0}}function e(){return 6===x[0].XXstopSegment&&6===x[1].XXstopSegment&&6===x[2].XXstopSegment?5:3===x[0].XXstopSegment&&3===x[1].XXstopSegment&&3===x[2].XXstopSegment?10:0===x[0].XXstopSegment&&0===x[1].XXstopSegment&&0===x[2].XXstopSegment?30:0}function f(){n.aspect=window.innerWidth/window.innerHeight,n.updateProjectionMatrix(),o.setSize(window.innerWidth,window.innerHeight),console.log("resize!")}function g(){l.update();var a=K.getDelta();I.update(a);var b=typeof x[2];if("undefined"!==b){var c;switch(i){case 0:break;case 1:for(c=0;3>c;c+=1)x[c].XXspinUntil=K.getElapsedTime()+2*c+3,x[c].XXstopSegment=J.getNumber(c);i=2,j+=1,document.getElementById("gamesPlayed").innerHTML="Credits Played: "+j;break;case 2:for(c=0;3>c;c+=1)if(x[c].XXsegment===x[c].XXstopSegment&&x[c].XXspinUntil<K.getElapsedTime())x[c].rotation.x=x[c].XXsegment*h-.2,2===c&&(i=3);else{for(x[c].XXposition+=3*a;x[c].XXposition>2*Math.PI;)x[c].XXposition-=2*Math.PI;x[c].rotation.x=x[c].XXposition-.2,x[c].XXsegment=Math.floor(x[c].XXposition/h)}break;case 3:i=0!==e()?4:0;break;case 4:for(L=[],M=[],N=[],O=0,P=e(),Q=[],R=0,O=0;P>O;O+=1)N[O]=new THREE.Mesh(G,H),N[O].rotation.z=50*Math.random(),N[O].castShadow=!0,N[O].position.x=(O+.5)*(40/P)-20,L[O]=Math.PI,M[O]=.5*Math.random()+1,Q[O]=!1,m.add(N[O]);i=5;break;case 5:for(O=0;P>O;O+=1)L[O]<2*Math.PI?(L[O]+=a*M[O],N[O].position.z=24+12*Math.cos(L[O]),N[O].position.y=-4+20*Math.abs(Math.sin(L[O])),N[O].rotation.z+=a):Q[O]===!1&&(m.remove(N[O]),R+=1,Q[O]=!0,console.log(R));R>=P&&(k+=P,document.getElementById("creditsWon").innerHTML="Credits Won: "+k,L=[],M=[],N=[],i=0,console.log("coinDone: "+R),console.log("amtwon: "+P))}}J.generate(),window.requestAnimationFrame(g),o.render(m,n)}var h=Math.PI/4,i=0,j=0,k=0,l=a(),m=new THREE.Scene,n=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,1e3),o=new THREE.WebGLRenderer;o.setClearColor(new THREE.Color(12119551,1)),o.setSize(window.innerWidth,window.innerHeight),o.shadowMapEnabled=!0;var p=new THREE.PlaneBufferGeometry(150,150),q=new THREE.MeshLambertMaterial({color:12320512}),r=new THREE.Mesh(p,q);r.receiveShadow=!0,r.rotation.x=-.5*Math.PI,r.position.x=0,r.position.y=-15,r.position.z=0,m.add(r),n.position.x=25,n.position.y=10,n.position.z=60,n.lookAt(m.position);var s=new THREE.AmbientLight(3355443);m.add(s);var t=new THREE.SpotLight(16777215);t.position.set(20,50,100),t.castShadow=!0,m.add(t);var u,v,w,x=[];u=THREE.ImageUtils.loadTexture("images/wheel.png"),u.minFilter=THREE.NearestFilter,v=new THREE.MeshPhongMaterial({ambient:10066329,color:16777215,specular:3355443,shininess:8,shading:THREE.SmoothShading,map:u}),w=new THREE.JSONLoader,w.load("js/wheel.js",function(a){var b=0;for(b=0;3>b;b+=1)x[b]=new THREE.Mesh(a,v),x[b].scale.x=10,x[b].scale.y=10,x[b].scale.z=10,x[b].position.x=10*b-10,x[b].castShadow=!0,m.add(x[b]),x[b].XXsegment=0,x[b].XXposition=0,x[b].XXspinUntil=0,x[b].XXstopSegment=0,x[b].rotation.x=x[b].XXsegment*h-.2});var y=new THREE.CylinderGeometry(.5,.5,30,16),z=new THREE.MeshLambertMaterial({color:65280,ambient:65280}),A=new THREE.Mesh(y,z);A.rotation.z=-.5*Math.PI,A.position.z=9.2,A.position.y=-5,A.castShadow=!0,m.add(A);var B=new THREE.Mesh(y,z);B.rotation.z=-.5*Math.PI,B.position.z=9.2,B.position.y=5,B.castShadow=!0,m.add(B);var C=new THREE.BoxGeometry(15,2.5,5),D=THREE.ImageUtils.loadTexture("images/start.png"),E=new THREE.MeshLambertMaterial({color:16776960,ambient:16776960});E.map=D;var F=new THREE.Mesh(C,E);F.position.z=15,F.position.y=-14,F.castShadow=!0,m.add(F);var G=new THREE.CylinderGeometry(3,3,1,18),H=new THREE.MeshLambertMaterial({color:16776960,ambient:16776960}),I=new THREE.OrbitControls(n);I.rotateSpeed=1,I.zoomSpeed=1,I.panSpeed=1,I.noPan=!0,I.maxPolarAngle=Math.PI/2,I.minAzimuthAngle=-Math.PI/2,I.maxAzimuthAngle=Math.PI/2,I.minDistance=25,I.maxDistance=100,window.addEventListener("keydown",function(a){(32===a.keyCode||13===a.keyCode)&&(F.position.y=-15,0===i&&(i=1))},!1),window.addEventListener("keyup",function(a){(32===a.keyCode||13===a.keyCode)&&(F.position.y=-14)},!1),document.addEventListener("mousedown",b,!1),document.addEventListener("mouseup",c,!1),window.addEventListener("resize",f,!1),document.body.appendChild(o.domElement);var J=new d,K=new THREE.Clock,L=[],M=[],N=[],O=0,P=0,Q=[],R=0;g()}window.onload=virtualSlotMachine;