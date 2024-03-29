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



export function x_rotation(deltaTime) {
    const l_x = main.helicopterVar['l_x'];
    main.variables.omega_x1 = main.variables.omega_x2;

    main.conditions['Fr_x_rotation'] = 0.5 * main.conditions['density'] * Math.pow((main.variables.omega_x1 * l_x), 2) * main.helicopterVar['a_xz'] * main.conditions['air_froce_constant'];
    if (main.variables.omega_x1 < 0) {
        main.conditions['Fr_x_rotation'] *= -1;
    }

    let determinationOutcome = (main.helicopterVar['lift'] * Math.cos(main.variables.phi_z - main.variables.current_z_rotation) * Math.sin(main.variables.phi_x - main.variables.current_x_rotation) * main.helicopterVar['d_main']

    )
        - (main.conditions['Fr_x_rotation'] * l_x);

    console.log('determinationOutcome : ' + determinationOutcome)

    const alpha_x = determinationOutcome / main.helicopterVar['inertia']

    main.variables.omega_x2 = main.variables.omega_x1 + deltaTime * alpha_x;

    main.variables.current_x_rotation += deltaTime * main.variables.omega_x2;
    main.helicopter.rotateX(deltaTime * main.variables.omega_x2)


}


export function z_rotation(deltaTime) {
    const l_z = main.helicopterVar['l_z'];
    main.variables.omega_z1 = main.variables.omega_z2;

    main.conditions['Fr_z_rotation'] = 0.5 * main.conditions['density'] * Math.pow((main.variables.omega_z1 * l_z), 2) * main.helicopterVar['a_yz'] * main.conditions['air_froce_constant'];
    if (main.variables.omega_z1 < 0) {
        main.conditions['Fr_z_rotation'] *= -1;
    }
    let determinationOutcome = (main.helicopterVar['lift'] * Math.cos(main.variables.phi_x - main.variables.current_x_rotation) * Math.sin(main.variables.phi_z - main.variables.current_z_rotation) * main.helicopterVar['d_main']

    ) - (main.conditions['Fr_z_rotation'] * l_z);


    const alpha_z = determinationOutcome / main.helicopterVar['inertia'];
    main.variables.omega_z2 = main.variables.omega_z1 + deltaTime * alpha_z;


    main.variables.current_z_rotation += deltaTime * main.variables.omega_z2;
    main.helicopter.rotateZ(deltaTime * main.variables.omega_z2);
}


export function y_rotation(deltaTime) {
    const l_y = main.helicopterVar['l_y'];
    const A = main.helicopterVar['mainBladeArea'] * main.helicopterVar['bladeNumber'];
    const v = Math.sqrt((2 * main.helicopterVar['lift']) / (main.conditions['density'] * A * main.helicopterVar['lift_coefficient']));

    const determination_main = main.conditions['density'] * A * main.helicopterVar['bladeRadius'] * main.helicopterVar['mainAngularVelocity'] * v * main.helicopterVar['d_main'];
    const angularS = main.helicopterVar['tailAngularVelocity'];
    let lift_tail = (main.conditions['density'] * angularS * angularS * main.helicopterVar['tailBladeArea'] * main.helicopterVar['tailNumber'] * main.helicopterVar['lift_coefficient'] * Math.pow(main.helicopterVar['tailRaduis'], 3)) / 6;

    const determination_tail = lift_tail * main.helicopterVar['d_tail'];
    main.conditions['Fr_y_rotation'] = 0.5 * main.conditions['density'] * Math.pow((main.variables.omega_y1 * l_y), 2) * main.helicopterVar['a_yz'] * main.conditions['air_froce_constant'];
    const determination_Fr_y = main.conditions['Fr_y_rotation'] * main.helicopterVar['l_y'];

    const determinationOutcome = determination_main - determination_tail - determination_Fr_y;

    const alpha_y = determinationOutcome / main.helicopterVar['inertia'];

    main.variables.omega_y2 = main.variables.omega_y1 + deltaTime * alpha_y;

    main.variables.camera_y_rotation += deltaTime * main.variables.omega_y2;
    main.helicopter.rotateY(deltaTime * main.variables.omega_y2);
}
