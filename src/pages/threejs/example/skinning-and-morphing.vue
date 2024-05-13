<template>
  <div class="w100% h100%" id="skinning-and-morphing"></div>
</template>
<script setup name="skinning-and-morphing">
/**
 * skinning-and-morphing
 */
/**
 * Stats 是性能监视器，用于显示帧率
 * Mesh 网格-基于三角形多边形网格对象的类
 * lil-gui 会获取一个对象和该对象上的属性名，并根据属性的类型自动生成一个 UI 来操作该属性。在此处的作用是在右上角创建一个可控制的面板
 * GLTFLoader glTF 2.0 资源的加载器
 * AnimationMixer 动画混合器，是场景中特定对象的动画播放器。当场景中的多个对象需要独立动画时，每个对象可以使用一个 AnimationMixer。
 * HemisphereLight 光源位于场景正上方，颜色从天空色渐变到地面色。
 * DirectionalLight 向特定方向发射的光线。这种光线的表现就好像它无限远，从它发出的光线都是平行的。这种光线的常见用途是模拟日光；太阳距离足够远，其位置可以被视为无限远，从太阳发出的所有光线都是平行的。
 * PlaneGeometry 用于生成平面几何图形的类。
 * MeshPhongMaterial 一种用于具有镜面反射亮点的闪亮表面的材料。
 * 
 * 步骤：
 * 1、创建容器、相机、场景、环境光、
 * 2、将环境光添加到场景中
 * 3、使用网格，添加材质，创建地面，并添加到场景中
 * 4、加载模型
 * 5、创建渲染器，渲染器将场景和相机渲染出来
 * （面板操作单独提出来）
 */
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getAssetsFile } from '@/utils/index.js'
let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

const api = { state: 'Walking' };

onMounted(() => {
  init();
  animate();
});

function init() {
  container = document.getElementById('skinning-and-morphing');
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    100
  );
  camera.position.set(-5, 3, 10);
  camera.lookAt(0, 2, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0e0);
  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

  clock = new THREE.Clock();

  // lights
  // 添加之后地面变亮了，因为HemisphereLight是从正上方往下照射
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  // 从正面打来的光
  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);

  // ground 创建网格对象
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
  );

  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // model
  const loader = new GLTFLoader();
  const srcImg = getAssetsFile('glbs/RobotExpressive.glb');
  loader.load(
    srcImg,
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      createGUI(model, gltf.animations);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  // stats
  stats = new Stats();
  container.appendChild(stats.dom);
}

function createGUI(model, animations) {
  const states = [
    'Idle',
    'Walking',
    'Running',
    'Dance',
    'Death',
    'Sitting',
    'Standing'
  ];
  const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

  gui = new GUI();

  mixer = new THREE.AnimationMixer(model);

  actions = {};

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;

    if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

  // states

  const statesFolder = gui.addFolder('States');
  const clipCtrl = statesFolder.add(api, 'state').options(states);
  clipCtrl.onChange(function () {
    fadeToAction(api.state, 0.5);
  });
  statesFolder.open();

  // emotes
  const emoteFolder = gui.addFolder('Emotes');
  function createEmoteCallback(name) {
    api[name] = function () {
      fadeToAction(name, 0.2);
      mixer.addEventListener('finished', restoreState);
    };
    emoteFolder.add(api, name);
  }

  function restoreState() {
    mixer.removeEventListener('finished', restoreState);
    fadeToAction(api.state, 0.2);
  }

  for (let i = 0; i < emotes.length; i++) {
    createEmoteCallback(emotes[i]);
  }
  emoteFolder.open();

  // expressions
  face = model.getObjectByName('Head_4');
  const expressions = Object.keys(face.morphTargetDictionary);
  const expressionFolder = gui.addFolder('Expressions');
  for (let i = 0; i < expressions.length; i++) {
    expressionFolder
      .add(face.morphTargetInfluences, i, 0, 1, 0.01)
      .name(expressions[i]);
  }

  activeAction = actions['Walking'];
  activeAction.play();
  expressionFolder.open();
}

function fadeToAction(name, duration) {
  previousAction = activeAction;
  activeAction = actions[name];
  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }
  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  const dt = clock.getDelta();
  if (mixer) mixer.update(dt);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}
</script>
<style lang="scss" scoped></style>
