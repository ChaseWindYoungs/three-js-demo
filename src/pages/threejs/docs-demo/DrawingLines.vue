<template>
  <div class="w100% h100%" id="container"></div>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';

let scene = null,
  camera = null,
  cube = null,
  renderer = null;

function init() {
  const container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    500
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
});
</script>
<style scoped lang="scss"></style>
