
var scene = new THREE.Scene();
var container = document.getElementById("container")
scene.background = new THREE.Color( 0x4E6172 );
var camera = new THREE.PerspectiveCamera( 60, container.offsetWidth/container.offsetHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( container.offsetWidth, container.offsetHeight );
container.appendChild( renderer.domElement );
var controls = new THREE.OrbitControls(camera, renderer.domElement)

//GRID HELPER
var size = 10;
var divisions = 10;
let grid = new THREE.GridHelper(size, divisions);
let axesHelper = new THREE.AxesHelper(3, 4);
scene.add(grid);
scene.add(axesHelper);




//GEOMETRY
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.set(0, 2, 2);




//LIGHTS
var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 40, 50, 50 );
scene.add( light );
//Ambient
var light = new THREE.AmbientLight( 0x4E6172, 2 ); // soft white light
scene.add( light );


//UPDATE ON RESIZE
window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
}

//RENDER
var animate = function () {
	requestAnimationFrame( animate );

	controls.update();

	cube.rotation.x += guiControls.rotationX;
	cube.rotation.y += guiControls.rotationY;
	cube.rotation.z += guiControls.rotationZ;



	renderer.render( scene, camera );
};

//GUI
let guiControls = new function(){
	this.rotationX = 0.01;
	this.rotationY = 0.01;
	this.rotationZ = 0.01;
}

let options = {
	reset: function() {
		guiControls.rotationX = 0.01;
		guiControls.rotationY = 0.01;
		guiControls.rotationZ = 0.01;
		cube.material.wireframe = false;
	  }
}

window.onload = function(){
	let gui = new dat.GUI();
	gui.add(guiControls, 'rotationX', 0, 0.5).listen();
	gui.add(guiControls, 'rotationY', 0, 0.5).listen();
	gui.add(guiControls, 'rotationZ', 0, 0.5).listen();
	gui.add(cube.material, 'wireframe').listen();
	gui.add(options, 'reset')
};

animate();