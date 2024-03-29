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

export function calculateLiftforce(deltaTime) {
  const weight = main.helicopterVar['mass'] * main.conditions['gravity'];
  const angularS = main.helicopterVar['mainAngularVelocity'];

  main.helicopterVar['lift'] = (main.conditions['density'] * angularS * angularS * main.helicopterVar['mainBladeArea'] * main.helicopterVar['bladeNumber'] * main.helicopterVar['lift_coefficient'] * Math.pow(main.helicopterVar['bladeRadius'], 3)) / 6;

  main.variables.v_y1 = main.variables.v_y2;

  if (main.variables.v_y1 >= 0) {
    main.conditions['Fr_y'] = 0.5 * main.conditions['density'] * main.variables.v_y1 * main.variables.v_y1 * main.helicopterVar['a_xz'] * main.conditions['air_froce_constant'];
  }
  else {
    main.conditions['Fr_y'] = -0.5 * main.conditions['density'] * main.variables.v_y1 * main.variables.v_y1 * main.helicopterVar['a_xz'] * main.conditions['air_froce_constant'];
  }
  const lift_main_y = main.helicopterVar['lift'] * Math.cos(main.variables.phi_x) * Math.cos(main.variables.phi_z);
  let Ay = (-main.conditions['Fr_y'] - weight + lift_main_y) / main.helicopterVar['mass'];
  if (main.helicopter.position.y <= 13) {
    Ay += weight / main.helicopterVar['mass'];
  }
  
  console.log (main.variables.v_y1, 'Fr_y' ,  main.conditions['Fr_y'] , 'main.helicopter.position.y', main.helicopter.position.y)

  if (main.helicopterVar['lift'] > 0.0)
    main.variables.phi_y = Math.acos(lift_main_y / main.helicopterVar['lift']);
  if (main.variables.phi_y > 0.5) {
    main.variables.phi_y = 0.5
  }
  else if (main.variables.phi_y < -0.5) {
    main.variables.phi_y = -0.5
  }
  main.variables.v_y2 = main.variables.v_y1 + deltaTime * Ay;
  let y2 = main.helicopter.position.y + deltaTime * main.variables.v_y2;

  if (y2 <= 13) {
    y2 = 13;
    main.variables.v_y1 = 0;
    main.variables.v_y2 = 0;
  }
  console.log('Ay= ' , Ay, "left y = " , lift_main_y , 'wieght = ', weight , 'y2 = ' ,y2 , " " , main.helicopter.position.y)
  main.helicopter.position.y = y2;
}

export function z_axis_movement(deltaTime) {
  main.variables.v_z1 = main.variables.v_z2;

  const lift_main_z = (Math.sin(main.helicopter.rotation.y) * Math.sin(main.variables.phi_z) + Math.cos(main.helicopter.rotation.y) * Math.sin(main.variables.phi_x) * Math.cos(main.variables.phi_z)) * main.helicopterVar['lift'];

  if (main.variables.v_z1 >= 0) {
    main.conditions['Fr_z'] = 0.5 * main.conditions['density'] * main.variables.v_z1 * main.variables.v_z1 * main.helicopterVar['a_xy'] * main.conditions['air_froce_constant'];
  }
  else {
    main.conditions['Fr_z'] = -0.5 * main.conditions['density'] * main.variables.v_z1 * main.variables.v_z1 * main.helicopterVar['a_xy'] * main.conditions['air_froce_constant'];
  }
  let az = (-main.conditions['Fr_z'] + lift_main_z) / main.helicopterVar['mass']
  if (main.helicopter.position.y <= 13) {
    az = 0;
    main.variables.v_z1 = 0;
  }

  main.variables.v_z2 = main.variables.v_z1 + deltaTime * az
  main.helicopter.translateZ(deltaTime * main.variables.v_z2)
}

export function x_axis_movement(deltaTime) {
  main.variables.v_x1 = main.variables.v_x2;

  const lift_main_x = (-Math.sin(main.variables.phi_z) * Math.cos(main.helicopter.rotation.y) + Math.sin(main.helicopter.rotation.y) * Math.sin(main.variables.phi_x) * Math.sin(main.variables.phi_z)) * main.helicopterVar['lift'];

  if (main.variables.v_x1 >= 0) {
    main.conditions['Fr_x'] = 0.5 * main.conditions['density'] * main.variables.v_x1 * main.variables.v_x1 * main.helicopterVar['a_yz'] * main.conditions['air_froce_constant'];
  }
  else {
    main.conditions['Fr_x'] = -0.5 * main.conditions['density'] * main.variables.v_x1 * main.variables.v_x1 * main.helicopterVar['a_yz'] * main.conditions['air_froce_constant'];
  }
  let ax = (-main.conditions['Fr_x'] + lift_main_x) / main.helicopterVar['mass'];
  if (main.helicopter.position.y <= 13) {
    ax = 0;
    main.variables.v_x1 = 0;
  }

  main.variables.v_x2 = main.variables.v_x1 + deltaTime * ax;
  main.helicopter.translateX(main.variables.v_x2 * deltaTime)
}
