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
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  const container = document.getElementById('container');
  console.log(container.clientWidth)
  console.log(container.clientHeight)
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 'white' });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
onMounted(() => {
  init();
  animate();
});
</script>
<style scoped lang="scss">
</style>
