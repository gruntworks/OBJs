var camera, renderer, scene, gui, guiData

init();
animate();


function init(){
	
	var container = document.getElementById("container")
	camera = new THREE.PerspectiveCamera( 60, container.offsetWidth/container.offsetHeight, 1, 1000 );
	camera.position.set(0, 2, 2);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );
	
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.screenSpacePanning = true;
	
	window.addEventListener('resize', onWindowResize, false);

	
	guiData = {
		currentURL:'models/Mjolnir.obj',
		wireframe: false
	};
	
	loadModel(guiData.currentURL)
	createGui();
}

function loadModel(modelURL){
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x4E6172 );
	
	let grid = new THREE.GridHelper(10, 10);
	let axesHelper = new THREE.AxesHelper(3, 4);
	scene.add(grid);
	scene.add(axesHelper);
	
	//LIGHTS
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( 40, 50, 50 );
	scene.add( light );
	var light = new THREE.AmbientLight( 0x4E6172, 2 ); // soft white light
	scene.add( light );

	//Load Model
	var loader = new THREE.OBJLoader();
	loader.load(modelURL, function ( object ) {

		let material = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe:guiData.wireframe} );
		object.traverse( function ( node ) {

			if ( node.isMesh ){
				
				node.material = material;
				if (material.wireframe) node.material.wireframe = true;
			} 
			
		
		  } );
		scene.add( object );
		console.log(object);

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	})
	
	
	// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
	// var cube = new THREE.Mesh( geometry, material );
	// scene.add( cube );
}


function onWindowResize(){
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize(container.offsetWidth, container.offsetHeight);
}


function animate(){
	requestAnimationFrame( animate );
	render();

	// cube.rotation.x += guiControls.rotationX;
	// cube.rotation.y += guiControls.rotationY;
	// cube.rotation.z += guiControls.rotationZ;

};

function createGui(){

	if (gui) gui.destroy();
	gui = new dat.GUI({width:350});

	gui.add(guiData, 'currentURL', {
		"Mjolnir":'models/Mjolnir.obj',
		"Knight":'models/Knight.obj',
		"Armor Glove":'models/ArmorHand.obj',
		"Frodo's sword":'models/Stinger.obj',

	}).name('Model').onChange(update);
	
	gui.add(guiData, 'wireframe').onChange(update);

	function update(){
		loadModel(guiData.currentURL);
	}
	
	
}

function render(){

	renderer.render( scene, camera );
}
