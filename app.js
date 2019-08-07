let camera, renderer, scene, gui, guiData

init();
animate();


function init(){
	
	const container = document.getElementById("container")
	camera = new THREE.PerspectiveCamera( 60, container.offsetWidth/container.offsetHeight, 0.1, 1000 );
	camera.position.set(0, 2, 2);
	
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );
	
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.screenSpacePanning = true;
	
	window.addEventListener('resize', onWindowResize, false);
	
	guiData = {
		BackgroundColor:'#1a2224',
		currentURL:'models/Mjolnir.obj',
		material: 'Basic'
		
	};

	console.log("INIT");
	
	loadModel(guiData.currentURL)
	// createGui(); Not needed since gui is creating after assigning a material
}

function loadModel(modelURL){
	
	scene = new THREE.Scene();
	scene.background = guiData.BackgroundColor;
	let grid = new THREE.GridHelper(10, 10);
	let axesHelper = new THREE.AxesHelper(3, 4);
	scene.add(grid);
	scene.add(axesHelper);
	
	//LIGHTS
	let light = new THREE.PointLight( 0x1FE0FF, 2, 80 );
	let ambiLight = new THREE.AmbientLight( 0x404040, 3 ); // soft white light
	light.position.set( 30, 70, 0 );
	scene.add(light);
	scene.add(light);
	scene.add(ambiLight);

	//LOAD MANAGER FOR LOADER
	const manager = new THREE.LoadingManager();
	const load = document.getElementById("loading-screen");
	const error = document.getElementById("error");
	manager.onStart = function(){
		error.style.display = "none";
		load.classList.remove('fade-out')
		load.style.display = "block";
		
	}
	
	manager.onLoad = function(){
		load.classList.add( 'fade-out' );
		setTimeout(() =>{
			load.style.display = "none";
		}, 700);
	}

	manager.onError = function(){
		error.style.display = "block";

	}

	//LOAD MODEL
	let loader = new THREE.OBJLoader(manager);
	loader.load(modelURL, function ( object ) {

		let material = new THREE.MeshLambertMaterial( { color: 0xffffff} );

		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material = material;
			}});

		scene.add( object );
		changeMaterial();
		console.log(object);
	

	},

	// called when loading is in progresses
	function ( xhr ) {
		let loadPercentage = xhr.loaded / xhr.total * 100;
		console.log( loadPercentage + '% loaded' );
	},

	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	});

	console.log("LOAD MODEL UPDATE");
}


function onWindowResize(){
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.offsetWidth, container.offsetHeight);
}


function animate(){
	requestAnimationFrame( animate );
	render();
};

function createGui(){
	console.log('GUI');
	if (gui) gui.destroy();
	gui = new dat.GUI({width:400});
	
	gui.addColor(guiData, 'BackgroundColor' ).onChange((val) =>{scene.background = new THREE.Color(val)});

	gui.add(guiData, 'currentURL', {
		"Mjolnir":'models/Mjolnir.obj',
		"Knight":'models/Knight.obj',
		"Armor Glove":'models/ArmorHand.obj',
		"Frodo's sword":'models/Stinger.obj',
		"Error":'models/Error.obj',

	}).name('Model').onChange(update);
	
	gui.add(guiData, 'material', ['Basic', 'Wireframe', 'Glossy']).onChange(changeMaterial);
	
}

function update(){
	loadModel(guiData.currentURL);
}

function changeMaterial(){
	phongData = {
		MeshColor:'#e5e5e5',
		Specular: "#009900",
		Shininess: 30,
		FlatShading: false
	}
	if (guiData.material == 'Glossy'){
		createGui();
		let material = new THREE.MeshPhongMaterial( { color: 0xe5e5e5, specular: 0x009900, shininess: 30} );
		assignMaterial(material);
		let props = gui.addFolder('Phong');
		props.addColor(phongData, 'MeshColor').onChange(val => material.color = new THREE.Color(val));
		props.addColor(phongData, 'Specular').onChange(val => material.specular = new THREE.Color(val));
		props.add(phongData, 'Shininess', 0, 100).onChange(val => material.shininess = val);
		props.add(phongData, 'FlatShading').onChange(val => {material.flatShading = val; material.needsUpdate = true});
		props.open();
		console.log("PHONG UPDATE");
	}
	
	if (guiData.material == 'Basic'){
		createGui();
		let material = new THREE.MeshLambertMaterial();
		assignMaterial(material);
		console.log("LAMBERT UPDATE");
	}

	if (guiData.material == 'Wireframe'){
		createGui();
		let material = new THREE.MeshBasicMaterial( {wireframe:true} );
		gui.addColor(phongData, 'MeshColor').name('Wireframe Color').onChange(val => material.color = new THREE.Color(val));
		assignMaterial(material);
		console.log("WIREFRAME UPDATE");
	}
}

function assignMaterial(material){
	scene.traverse( function ( node ) {		
		if ( node.isMesh ){
			node.material = material;
		} 
	} );
}

function render(){
	renderer.render( scene, camera );
}

