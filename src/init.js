import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { script } from './script.js';
import * as main from './script.js';


export async function loadObject(objectUrl) {
    return new Promise((resolve, reject) => {
      const mtlloader = new MTLLoader();
  
      mtlloader.load(objectUrl + '.mtl', function (materials) {
        materials.preload();
        const loader = new OBJLoader();
        loader.setMaterials(materials);
        loader.load(
          objectUrl + '.obj',
          function (object) {
            resolve(object)
          },
  
          function (xhr) {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
  
          function (error) {
            reject(error)
          }
        );
      });
    });
  }

export async function init() {
    main.audioLoader.load('/sound.mp3', function (buffer) {
        main.audio.setBuffer(buffer);
        main.audio.setLoop(false); // Set to true if you want the audio to loop
        main.audio.setVolume(6); // Set the volume between 0 and 1
    });

    main.env.startTime = Date.now()
    main.env.container = document.getElementById("container");

    main.env.renderer = new THREE.WebGLRenderer();
    main.env.renderer.setPixelRatio(window.devicePixelRatio);
    main.env.renderer.setSize(window.innerWidth, window.innerHeight);
    main.env.container.appendChild(main.env.renderer.domElement);

    main.env.scene = new THREE.Scene();

    main.env.camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1,
        20000
    );
    main.env.sun = new THREE.Vector3();



    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    main.env.water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
            "textures/waternormals.jpg",
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: main.env.scene.fog !== undefined,
    });

    main.env.water.rotation.x = -Math.PI / 2;

    main.env.scene.add(main.env.water);

    const sky = new Sky();
    sky.scale.setScalar(10000);
    main.env.scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180,
    };

    const pmremGenerator = new THREE.PMREMGenerator(main.env.renderer);
    let renderTarget;

    function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        main.env.sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms["sunPosition"].value.copy(main.env.sun);
        main.env.water.material.uniforms["sunDirection"].value.copy(main.env.sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene(sky);
        main.env.scene.environment = renderTarget.texture;
    }

    updateSun();





    // Helicopter base
    const baseGeometry = new THREE.BoxGeometry(150, 5, 150);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0 });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    main.env.scene.add(baseMesh);

    // Letter "H" for helicopter
    const letterGeometry = new THREE.BoxGeometry(15, 80, 10);
    const letterMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0 });
    const letter1 = new THREE.Mesh(letterGeometry, letterMaterial);
    letter1.position.set(-30, 0 - 2, 0);
    letter1.rotation.set(Math.PI / 2, 0, 0);
    baseMesh.add(letter1);

    const letter2 = new THREE.Mesh(letterGeometry, letterMaterial);
    letter2.position.set(30, -2, 0);
    letter2.rotation.set(Math.PI / 2, 0, 0);
    baseMesh.add(letter2);

    const letter3 = new THREE.Mesh(new THREE.BoxGeometry(55, 10, 10), letterMaterial);
    letter3.position.set(0, -2, 0);
    letter3.rotation.set(Math.PI / 2, 0, 0);

    baseMesh.add(letter3);

    // Position the base
    baseMesh.position.set(0, 2.5, 0);

    const helicopterBase = (x, y, z) => {
        // Helicopter base
        const baseGeometry = new THREE.BoxGeometry(150, 5, 150);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0,
        });
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);

        // Letter "H" for helicopter
        const letterGeometry = new THREE.BoxGeometry(15, 80, 10);
        const letterMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0,
        });
        const letter1 = new THREE.Mesh(letterGeometry, letterMaterial);
        letter1.position.set(-30, 0 - 2, 0);
        letter1.rotation.set(Math.PI / 2, 0, 0);
        baseMesh.add(letter1);

        const letter2 = new THREE.Mesh(letterGeometry, letterMaterial);
        letter2.position.set(30, -2, 0);
        letter2.rotation.set(Math.PI / 2, 0, 0);
        baseMesh.add(letter2);

        const letter3 = new THREE.Mesh(
            new THREE.BoxGeometry(55, 10, 10),
            letterMaterial
        );
        letter3.position.set(0, -2, 0);
        letter3.rotation.set(Math.PI / 2, 0, 0);

        baseMesh.add(letter3);

        // Position the base
        baseMesh.position.set(x, y, z);
        main.env.scene.add(baseMesh);
    };

    helicopterBase(0, 2.5, 0);
    helicopterBase(500, 2.5, 0);
    helicopterBase(1000, 2.5, 0);
    helicopterBase(1500, 2.5, 0);
    helicopterBase(2000, 2.5, 0);
    helicopterBase(-500, 2.5, 0);
    helicopterBase(-1000, 2.5, 0);
    helicopterBase(-1500, 2.5, 0);
    helicopterBase(-2000, 2.5, 0);
    helicopterBase(0, 2.5, 500);
    helicopterBase(0, 2.5, 1000);
    helicopterBase(0, 2.5, 1500);
    helicopterBase(0, 2.5, 2000);
    helicopterBase(0, 2.5, -500);
    helicopterBase(0, 2.5, -1000);
    helicopterBase(0, 2.5, -1500);
    helicopterBase(0, 2.5, -2000);

    main.env.controls = new OrbitControls(main.env.camera, main.env.renderer.domElement);
    main.env.controls.maxPolarAngle = Math.PI * 0.495;
    main.env.controls.target.set(0, 10, 0);
    main.env.controls.minDistance = 40.0;

    main.env.controls.update();

    main.env.stats = new Stats();
    main.env.container.appendChild(main.env.stats.dom);
    const infoDev = document.createElement('div')

    infoDev.className = 'infoDev'
    Object.keys(main.info).forEach(function (element) {
        main.info[element] = document.createElement('h6');
        main.info[element].className = 'infoText'


        infoDev.appendChild(main.info[element]);
        const div = document.createElement('hr')
        infoDev.appendChild(div)
    });
    main.env.container.appendChild(infoDev)



    const gui = new GUI();

    const folderSky = gui.addFolder("Sky");
    folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
    folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);


    const waterUniforms = main.env.water.material.uniforms;
    const folderWater = gui.addFolder("Water");

    const helciopterFolder = gui.addFolder("Helcipoter");
    folderWater.add(waterUniforms.distortionScale, "value", 0, 8, 0.1).name("distortionScale");
    folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
    helciopterFolder.add(main.helicopterVar, "tailAngularVelocity", -50, 50).name("tail velocity");
    helciopterFolder.add(main.helicopterVar, "mainAngularVelocity", 0, 10).name("main velocity");
    helciopterFolder.add(main.helicopterVar, "inertia", 250.0, 10000.0).name("inertia");
    helciopterFolder.add(main.helicopterVar, "mass", 250.0, 1000.0).name("mass");
    helciopterFolder.add(main.helicopterVar, "lift_coefficient", 0.5, 2.0).name("lift coefficient");
    helciopterFolder.add(main.helicopterVar, "mainBladeArea", 0.5, 5.0).name("blade area");
    helciopterFolder.add(main.helicopterVar, "tailBladeArea", 0.1, 2.0).name("tail area");
    helciopterFolder.add(main.helicopterVar, "bladeNumber", 3, 5).name("blade number").step(1);
    helciopterFolder.add(main.helicopterVar, "tailNumber", 3, 4).name("tail number").step(1);
    helciopterFolder.add(main.helicopterVar, "a_xz", 5.0, 32.0).name("top area");
    helciopterFolder.add(main.helicopterVar, "a_yz", 5.0, 48.0).name("side area");
    helciopterFolder.add(main.helicopterVar, "a_xy", 2.0, 20.0).name("front area");
    helciopterFolder.add(main.helicopterVar, "d_main", 1.5, 3.0).name("D Main");
    helciopterFolder.add(main.helicopterVar, "d_tail", 6, 11).name("D Tail");
    helciopterFolder.add(main.helicopterVar, "l_x", 5.0, 15.0).name("L X");
    helciopterFolder.add(main.helicopterVar, "l_y", 2.0, 5.0).name("L Y");
    helciopterFolder.add(main.helicopterVar, "l_z", 5.0, 12.0).name("L Z");



    helciopterFolder.add(main.helicopterVar, "bladeRadius", 5.0, 7.8).name("blade Radius").onChange(
        function (value) {
            main.env.pale1.scale.set((value / 7.62), 1, (value / 7.62))
        }
    );
    helciopterFolder.add(main.helicopterVar, "tailRaduis", 0.5, 1.0).name("tail Radius").onChange(
        function (value) {
            main.env.pale2.scale.set(1, (value / 0.8), (value / 0.8))
        }
    );
    //helciopterFolder.add(main.helicopterVar, 'autoPiolet').name('Auto Piolet');
    helciopterFolder.add(main.helicopterVar, 'ForceAutoBalance').name('Force Auto Balance');

    const conditionsFolder = gui.addFolder("Conditions");
    conditionsFolder.add(main.conditions, "gravity", -20.0, 20.0).name("gravity");
    conditionsFolder.add(main.conditions, "density", 0.5, 3.0).name("density");
    conditionsFolder.add(main.conditions, "air_froce_constant", 0.0, 2.0).name("air force constant");

    gui.close();

    async function loadHelicopter() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        const directionlLight = new THREE.DirectionalLight(0xffffff, 1)
        directionlLight.position.set(1, 1, 5)
        await loadObject('crops')
            .then((loadedObject) => {
                main.env.crops = loadedObject

            })
            .catch((error) => {
                // console.error(error);
            });
        await loadObject('pale1')
            .then((loadedObject) => {
                main.env.pale1 = loadedObject

                main.env.pale1.position.set(1.97614, 19.6584, 9.97987)

            })
            .catch((error) => {
                // console.error(error);
            });
        await loadObject('pale2')
            .then((loadedObject) => {
                main.env.pale2 = loadedObject
                main.env.pale2.position.set(3.58773, 19.946, -68.8846)

            })
            .catch((error) => {
                // console.error(error);
            });

            main.helicopter.add(main.env.pale1)
            main.helicopter.add(main.env.pale2)
            main.helicopter.add(main.env.crops)

            main.helicopter.position.set(0, 13, 0)


            main.env.scene.add(main.helicopter)
            main.env.scene.add(ambientLight, directionlLight)
    }


    await loadHelicopter();
    window.addEventListener("resize", main.onWindowResize);


    document.body.appendChild(main.env.renderer.domElement);




    // Event listener for keydown even
    document.addEventListener('keydown', function (event) {
        main.keys[event.key] = true;
        console.log(event.key);

    });

    // Add event listeners for keyup events
    document.addEventListener('keyup', function (event) {
        main.keys[event.key] = false;
        if (event.key === 'd' || event.key === 'a') {
            if (main.helicopterVar['ForceAutoBalance'])
                main.helicopterVar['autoBalance'] = true;
        }
    });




}
