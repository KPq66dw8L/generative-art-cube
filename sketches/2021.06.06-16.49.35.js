// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch"); //API qui contient playhead

import fragment from "./shader/fragment.glsl";
import fragmentLine from "./shader/fragment1.glsl";
import vertex from "./shader/vertex.glsl";
import vertexParticles from "./shader/vertexParticles.glsl";

const settings = {
  // Make the loop animated
  animate: true,
  duration: 3,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  fps: 25
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.IcosahedronBufferGeometry(1,6);
  const edgeGeo = new THREE.EdgesGeometry(geometry);
  // Setup a material
  // const gridTexture = new THREE.TextureLoader().load('grid.jpg');
  // const material1 = new THREE.MeshNormalMaterial({
  //   // color: "red",
  //   // wireframe: true
  //   flatShading: true
  // });

  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      playhead: { type: "f", value: 0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    // wireframe: true,
    // transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  const material1 = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      playhead: { type: "f", value: 0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    // wireframe: true,
    // transparent: true,
    vertexShader: vertex,
    fragmentShader: fragmentLine,
  });

  const material2 = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      playhead: { type: "f", value: 0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    // wireframe: true,
    // transparent: true,
    vertexShader: vertex,
    fragmentShader: fragmentLine,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  const meshLines = new THREE.LineSegments(edgeGeo, material1);
  const meshPoints = new THREE.Points(geometry, material2);

  scene.add(mesh);
  scene.add(meshLines);
  scene.add(meshPoints);

  meshLines.scale.set(1.0003,1.0003,1.0003); //for the lines not to be hidden a certain moments
  meshPoints.scale.set(1.003,1.003,1.003);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, playhead }) {
      // mesh.rotation.x = playhead*2*Math.PI;
      material.uniforms.playhead.value = playhead;
      material1.uniforms.playhead.value = playhead;
      material2.uniforms.playhead.value = playhead;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
