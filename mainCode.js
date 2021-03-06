var width = window.innerWidth
var height = window.innerHeight
var camera, renderer, scene
var spotLight


var surfaceMesh,
    goalMesh,
    postMesh,
    post2Mesh,
    goalkeeperMesh
var groundBody,
    groundShape,
    ball,
    ball2,
    ballBody,
    ballShape,
    field,
    goalkeeper,
    goalShape,
    goalBody,
    postShape,
    post2Shape,
    postBody,
    post2Body,
    goalkeeperShape,
    goalkeeperBody

var gltfloader,
    gltfloader1,
    gltfloader2


var mass,
    world,
    timeStep = 1 / 60
var cannonDebugRenderer
var phsyicRenderer = false
var time
var counter1 = 0,
    counter2 = 0,
    count1 = 0,
    count2 = 0
var balls = []
var countBall = 0
var ballsBodys = []
var scores = 0

var power = 0

var flag1 = 1


init()

initCannon()

animate()

async function init() {
    scene = new THREE.Scene()

    // Fog
    fogColor = new THREE.Color(0xcccccc);

    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 1, 120);


    //  Create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)

    //  Create a render and set the size
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Position and point the camera to the center of the scene
    camera.position.x = 0
    camera.position.y = 6
    camera.position.z = 25

    camera.lookAt(scene.position)

    // Add the output of the renderer to the html element
    document.getElementById("web-gl").appendChild(renderer.domElement)
    window.addEventListener("resize", onWindowResize, false)
    window.addEventListener("keyup", onDocumentKeyUp, false)
    window.addEventListener("keydown", onDocumentKeyDown, false)

    // << Surface >>
    var surfaceTexture = new THREE.TextureLoader().load("texture/floor1.jpg")
    surfaceTexture.repeat.set(10, 3)
    surfaceTexture.wrapS = THREE.RepeatWrapping
    surfaceTexture.wrapT = THREE.RepeatWrapping
    surfaceTexture.magFilter = THREE.NearestFilter
    surfaceTexture.minFilter = THREE.LinearMipMapLinearFilter
    var surfaceGeometry = new THREE.PlaneGeometry(70, 80)
    var surfaceMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide,
        map: surfaceTexture,
    })
    surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
    surfaceMesh.rotateX(-Math.PI / 2)
    surfaceMesh.position.y = -5
    surfaceMesh.position.z = -20
    surfaceMesh.receiveShadow = true
    scene.add(surfaceMesh)



    // Goal

    let goalTexture = THREE.ImageUtils.loadTexture('texture/floor1.jpg');
    goalTexture.repeat.set(4, 1);
    goalTexture.wrapS = THREE.RepeatWrapping;
    goalTexture.wrapT = THREE.RepeatWrapping;
    goalTexture.minFilter = THREE.NearestFilter;
    let goalGeometry = new THREE.BoxGeometry(7, 5, 1);
    let goalMaterial = new THREE.MeshPhongMaterial({
        map: goalTexture,
        shading: THREE.SmoothShading
    });
    goalMesh = new THREE.Mesh(goalGeometry, goalMaterial)
    goalMesh.rotateX(-Math.PI)
    goalMesh.position.y = -3
    goalMesh.position.z = -45
    goalMesh.position.x = 0
    goalMesh.receiveShadow = true
    goalMesh.visible = false
    scene.add(goalMesh)



    // Posts
    // 1:

    let postTexture = THREE.ImageUtils.loadTexture('texture/floor1.jpg');
    postTexture.repeat.set(4, 1);
    postTexture.wrapS = THREE.RepeatWrapping;
    postTexture.wrapT = THREE.RepeatWrapping;
    postTexture.minFilter = THREE.NearestFilter;
    let postGeometry = new THREE.BoxGeometry(0.5, 5, 0);
    let postMaterial = new THREE.MeshPhongMaterial({
        map: postTexture,
        shading: THREE.SmoothShading
    });
    postMesh = new THREE.Mesh(postGeometry, postMaterial)
    postMesh.rotateX(-Math.PI)
    postMesh.position.y = -3
    postMesh.position.z = -45
    postMesh.position.x = 0
    postMesh.receiveShadow = true
    postMesh.visible = false
    scene.add(postMesh)

    // 2:

    let post2Texture = THREE.ImageUtils.loadTexture('texture/floor1.jpg');
    post2Texture.repeat.set(4, 1);
    post2Texture.wrapS = THREE.RepeatWrapping;
    post2Texture.wrapT = THREE.RepeatWrapping;
    post2Texture.minFilter = THREE.NearestFilter;
    let post2Geometry = new THREE.BoxGeometry(0.5, 5, 0);
    let post2Material = new THREE.MeshPhongMaterial({
        map: postTexture,
        shading: THREE.SmoothShading
    });
    post2Mesh = new THREE.Mesh(post2Geometry, post2Material)
    post2Mesh.rotateX(-Math.PI)
    post2Mesh.position.y = -3
    post2Mesh.position.z = -45
    post2Mesh.position.x = 0
    post2Mesh.receiveShadow = true
    post2Mesh.visible = false
    scene.add(post2Mesh)

    //Goalkeeper

    let goalkeeperTexture = THREE.ImageUtils.loadTexture('texture/floor1.jpg');
    goalkeeperTexture.repeat.set(4, 1);
    goalkeeperTexture.wrapS = THREE.RepeatWrapping;
    goalkeeperTexture.wrapT = THREE.RepeatWrapping;
    goalkeeperTexture.minFilter = THREE.NearestFilter;
    let goalkeeperGeometry = new THREE.BoxGeometry(1, 5, 0);
    let goalkeeperMaterial = new THREE.MeshPhongMaterial({
        map:goalkeeperTexture,
        shading: THREE.SmoothShading
    });
    goalkeeperMesh = new THREE.Mesh(goalkeeperGeometry, goalkeeperMaterial)
    goalkeeperMesh.rotateX(-Math.PI)
    goalkeeperMesh.position.y = -3
    goalkeeperMesh.position.z = -45
    goalkeeperMesh.position.x = 0
    goalkeeperMesh.receiveShadow = true
    goalkeeperMesh.visible = false
    scene.add(goalkeeperMesh)


    // Shapes
    // << Ball >>
    let BallTexture = THREE.ImageUtils.loadTexture(
        "texture/ballImages/ball.jpg"
    )
    BallTexture.magFilter = THREE.NearestFilter
    BallTexture.minFilter = THREE.NearestFilter
    let BallGeometry = new THREE.SphereGeometry(1.0, 20, 20)
    var BallMaterial = new THREE.MeshPhongMaterial({
        map: BallTexture,
        shading: THREE.SmoothShading,
    })
    ball = new THREE.Mesh(BallGeometry, BallMaterial)
    ball.castShadow = true
    ball.receiveShadow = true
    balls.push(ball)
    balls[0].visible = false
    scene.add(balls[0])

    //Ball
    gltfloader2 = new THREE.GLTFLoader()

    gltfloader2.load('model/gltf/football/scene.gltf', function (gltf) {
    ball2 = gltf.scene
    ball2.scale.set(0.018,0.018 ,0.018);
    ball2.position.set(0,0,0);
    scene.add(ball2);
    });

    // Field
    gltfloader = new THREE.GLTFLoader()
    gltfloader.load("model/gltf/soccer field/scene.gltf", function (gltf) {
        field = gltf.scene
        field.scale.set(2, 2, 2)
        field.position.set(0 , -5, 0)
        
        scene.add(field)
    })

    //Goalkeeper

    gltfloader1 = new THREE.GLTFLoader()
    gltfloader1.load("model/gltf/voxel_goalkeeper/scene.gltf", function (gltf) {
        goalkeeper = gltf.scene
        goalkeeper.scale.set(0.5, 0.6, 0.5)
        goalkeeper.position.set(-2, 5, -35)
        scene.add(goalkeeper)
    })



    // Light
    //  Point Light >>
    pointLight = new THREE.PointLight(0xffffff, 1, 800, 4)
    pointLight.position.set(0, 20, 0)
    pointLight.castShadow = true
    pointLight.shadow.camera.near = 1
    pointLight.shadow.camera.far = 200
    pointLight.intensity = 1
    scene.add(pointLight)

    pointLight2 = new THREE.PointLight(0xffffff, 1, 800, 4)
    pointLight2.position.set(0, 20, 20)
    pointLight2.castShadow = true
    pointLight2.shadow.camera.near = 1
    pointLight2.shadow.camera.far = 200
    pointLight2.intensity = 1
    scene.add(pointLight2)

    // Spot Light >>
    // Near
    nearSpotLight = new THREE.SpotLight(0xffef00)
    nearSpotLight.angle = 0.8
    nearSpotLight.penumbra = 1
    nearSpotLight.position.set(0, 10, -2)
    nearSpotLight.castShadow = true
    nearSpotLight.intensity = 0.5
    nearSpotLight.shadow.mapSize.width = 512
    nearSpotLight.shadow.mapSize.height = 512
    nearSpotLight.shadow.camera.near = 0.5
    nearSpotLight.shadow.camera.far = 500
    nearSpotLight.visible = true
    scene.add(nearSpotLight)


    // Sound
    var listener = new THREE.AudioListener();
    camera.add(listener);
    var sound = new THREE.Audio(listener);
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/World Cup FIFA (2002).mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.7);
        sound.play();
    });

}



function initCannon() {
    //? World Setup
    world = new CANNON.World()
    world.gravity.set(0, -26, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 20
    world.defaultContactMaterial.contactEquationStiffness = 1e9
    world.defaultContactMaterial.contactEquationRelaxation = 4

    // Cannon && Physics

    // << Ball >>
    ballShape = new CANNON.Sphere(1.1)
    ballBody = new CANNON.Body({ mass: 700 })
    ballBody.addShape(ballShape)
    ballBody.angularDamping = 0.3
    ballBody.position.set(-6, 5, 7)
    ballsBodys.push(ballBody)
    world.add(ballsBodys[0])






    // Goal Physic
    goalShape = new CANNON.Box(new CANNON.Vec3(7, 2.0, 1.0));
    goalBody = new CANNON.Body({ mass: 1000 });
    goalBody.addShape(goalShape);
    goalBody.angularDamping = 1;
    goalBody.position.set(0, -3, -45);
    world.add(goalBody);

    // Posts Physic
    // 1:
    postShape = new CANNON.Box(new CANNON.Vec3(0.5, 2.0, 1.0));
    postBody = new CANNON.Body({ mass: 1000 });
    postBody.addShape(postShape);
    postBody.angularDamping = 1;
    postBody.position.set(-3.5, -3, -43);
    world.add(postBody);

    // 2:

    post2Shape = new CANNON.Box(new CANNON.Vec3(0.5, 2.0, 1.0));
    post2Body = new CANNON.Body({ mass: 1000 });
    post2Body.addShape(post2Shape);
    post2Body.angularDamping = 1;
    post2Body.position.set(3.5, -3, -43);
    world.add(post2Body);

    //Goalkeeper Physic

    goalkeeperShape = new CANNON.Box(new CANNON.Vec3(0.5, 2.0, 1.0));
    goalkeeperBody = new CANNON.Body({ mass: 1000 });
    goalkeeperBody.addShape(goalkeeperShape);
    goalkeeperBody.angularDamping = 1;
    goalkeeperBody.position.set(-3, -3, -35)
    world.add(goalkeeperBody);



    // Ground (Floor)
    groundShape = new CANNON.Plane()
    groundBody = new CANNON.Body({ mass: 0 })
    groundBody.addShape(groundShape)
    world.add(groundBody)
    groundBody.position.copy(surfaceMesh.position)
    groundBody.quaternion.copy(surfaceMesh.quaternion)

    cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world)
}

function animate() {

    requestAnimationFrame(animate)
    updatePhysics()
    if (phsyicRenderer) cannonDebugRenderer.update()
    render()
}

function updatePhysics() {
    // Main setup for Cannon JS
    world.step(timeStep)

    // Merge Mesh & Physic

    //Balls
    balls[0].position.copy(ballsBodys[0].position)
    balls[0].quaternion.copy(ballsBodys[0].quaternion)
    ball2.position.copy(new CANNON.Vec3(balls[0].position.x , balls[0].position.y , balls[0].position.z))
    ball2.quaternion.copy(ballsBodys[0].quaternion)


    // Goal
    goalMesh.position.copy(goalBody.position);
    goalMesh.quaternion.copy(goalBody.quaternion);

    // Post
    // 1:
    postMesh.position.copy(postBody.position);
    postMesh.quaternion.copy(postBody.quaternion);

    // 2:
    post2Mesh.position.copy(post2Body.position);
    post2Mesh.quaternion.copy(post2Body.quaternion);

    //Goalkepper
    goalkeeperMesh.position.copy(goalkeeperBody.position);
    goalkeeperMesh.quaternion.copy(goalkeeperBody.quaternion);
    goalkeeper.position.copy(new CANNON.Vec3(goalkeeperMesh.position.x - 2, goalkeeperMesh.position.y - 3 , goalkeeperMesh.position.z));
    goalkeeper.quaternion.copy(goalkeeperMesh.quaternion);
}

function render() {

    renderer.render(scene, camera)
    ballMove()
    goalkeeperMove()
    camera.updateMatrixWorld()
}

var seconds_passed = 0
function onDocumentKeyDown(event) {
    if (event.keyCode == 13) {
        power++
        if(power > 30){
            power = 30
        }
    }

    if (event.keyCode == 39) {
        ballsBodys[0].position.x += 0.1
    }
    if (event.keyCode == 37) {
        ballsBodys[0].position.x -= 0.1
    }
}

var i = 0
async function onDocumentKeyUp(event) {
    if (event.keyCode == 13) {
        if (countBall < 1)
            ballsBodys[countBall].velocity.set(0, -20, -(power * 2))
        countBall++

        if (countBall >= 1) {
            await setTimeout(function () {
                camera.position.x = 0
                camera.position.y = 5
                camera.position.z = -20
                camera.lookAt(table.position)
            }, 3000)
            setInterval(function () {
                if (flag1) {
                    let scorescore = document.getElementById("scorestate")
                    scorescore.innerHTML = checked()
                    flag1 = 0
                }
            }, 10000)
        }
    }
}

function checked() {

    if (ballsBodys[0].position.z < postBody.position.z && ballsBodys[0].position.x > postBody.position.x && ballsBodys[0].position.x < post2Body.position.x) {
        scores = "Goal!"
    }
    console.log(scores)
    return scores
}

function ballMove() {
    // console.log(ballsBodys[0].position.y)
    if (counter1 < 50) {
        if (countBall <= 0) {
            ballsBodys[0].position.x += 0.25
        }
        counter1++
    } else if (counter2 < 50 && counter1 == 50) {
        if (countBall <= 0) {
            ballsBodys[0].position.x -= 0.25
        }
        counter2++
    } else {
        counter1 = 0
        counter2 = 0
    }
}


function goalkeeperMove() {

    if (count1 < 110) {
        goalkeeperBody.position.x += 0.05
        count1++
    } else if (count2 < 110 && count1 == 110) {
        goalkeeperBody.position.x -= 0.05
        count2++
    } else {
        count1 = 0
        count2 = 0
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
