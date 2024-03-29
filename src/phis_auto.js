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



export function autoPiolet() {
    const requiredSpeed = Math.sqrt((6 * main.helicopterVar['mass'] * main.conditions['gravity']) / (main.conditions['density'] * main.helicopterVar['mainBladeArea'] * main.helicopterVar['bladeNumber'] * main.helicopterVar['lift_coefficient'] * Math.pow(main.helicopterVar['bladeRadius'], 3)));

    /*stopping the y Axis movement*/{
        if (main.helicopterVar['mainAngularVelocity'] > requiredSpeed + 0.01)
            main.helicopterVar['mainAngularVelocity'] -= 0.01;

        else if (main.helicopterVar['mainAngularVelocity'] < requiredSpeed - 0.01)
            main.helicopterVar['mainAngularVelocity'] += 0.01;

        else
            main.helicopterVar['mainAngularVelocity'] = requiredSpeed;
    }
    /*stopping the z Axis movement*/{
        if (main.variables.phi_x > 0 + 0.001)
            main.variables.phi_x -= 0.001;

        else if (main.variables.phi_x < 0 - 0.001)
            main.variables.phi_x += 0.001;

        else
            main.variables.phi_x = 0;

    }

    if (main.variables.phi_z > 0 + 0.001)
        main.variables.phi_z -= 0.001;

    else if (main.variables.phi_z < 0 - 0.001)
        main.variables.phi_z += 0.001;

    else
        main.variables.phi_z = 0;

}

export function autoBalance() {
    const A = main.helicopterVar['mainBladeArea'] * main.helicopterVar['bladeNumber'];
    const v = Math.sqrt((2 * main.helicopterVar['lift']) / (main.conditions['density'] * A * main.helicopterVar['lift_coefficient']));
    const determination_main = main.conditions['density'] * A * main.helicopterVar['bladeRadius'] * main.helicopterVar['mainAngularVelocity'] * v * main.helicopterVar['d_main'];

    const l_y = main.helicopterVar['l_y']
    main.conditions['Fr_y_rotation'] = 0.5 * main.conditions['density'] * Math.pow((main.variables.omega_y1 * l_y), 2) * main.helicopterVar['a_yz'] * main.conditions['air_froce_constant'];
    const determination_Fr_y = main.conditions['Fr_y_rotation'] * l_y;

    const determination_tail = determination_main - determination_Fr_y;
    const tail_lift_force_required = determination_tail / main.helicopterVar['d_tail'];

    const requiredTailSpeed = Math.sqrt((6 * tail_lift_force_required) / (main.conditions['density'] * main.helicopterVar['tailBladeArea'] * main.helicopterVar['tailNumber'] * main.helicopterVar['lift_coefficient'] * Math.pow(main.helicopterVar['tailRaduis'], 3)));

    if (main.helicopterVar['tailAngularVelocity'] > requiredTailSpeed + 0.8)
        main.helicopterVar['tailAngularVelocity'] -= 0.8 * main.helicopterVar['d_main'];

    else if (main.helicopterVar['tailAngularVelocity'] < requiredTailSpeed - 0.8)
        main.helicopterVar['tailAngularVelocity'] += 0.8 * main.helicopterVar['d_main'];

    else
        main.helicopterVar['tailAngularVelocity'] = requiredTailSpeed;

}