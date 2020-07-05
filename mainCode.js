var width = window.innerWidth
var height = window.innerHeight
var camera, renderer, scene
var spotLight

//physics
var surfaceMesh, groundBody, groundShape, ball, ballBody, ballShape, table
var pin
var mass,
    world,
    timeStep = 1 / 60
var cannonDebugRenderer
var phsyicRenderer = false
var time
var counter1 = 0,
    counter2 = 0
var balls = []
var countBall = 0
var ballsBodys = []
var pinArrayBody = []
var scores = 0
var goalMesh,
 
var power = 0
var postMesh,
post2Mesh,
var flag1 = 1

init()

initCannon()

animate()

async function init() {
    scene = new THREE.Scene()

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

    let goalTexture = THREE.ImageUtils.loadTexture("texture/floor1.jpg")
    goalTexture.repeat.set(4, 1)
    goalTexture.wrapS = THREE.RepeatWrapping
    goalTexture.wrapT = THREE.RepeatWrapping
    goalTexture.minFilter = THREE.NearestFilter
    let goalGeometry = new THREE.BoxGeometry(7, 5, 1)
    let goalMaterial = new THREE.MeshPhongMaterial({
        map: goalTexture,
        shading: THREE.SmoothShading,
    })
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

    

    // Shapes
    // << Bowling Ball >>
    let bowlingBallTexture = THREE.ImageUtils.loadTexture(
        "texture/ballImages/ball.jpg"
    )
    bowlingBallTexture.magFilter = THREE.NearestFilter
    bowlingBallTexture.minFilter = THREE.NearestFilter
    let bowlingBallGeometry = new THREE.SphereGeometry(1.0, 20, 20)
    var bowlingBallMaterial = new THREE.MeshPhongMaterial({
        map: bowlingBallTexture,
        shading: THREE.SmoothShading,
    })
    ball = new THREE.Mesh(bowlingBallGeometry, bowlingBallMaterial)
    ball.castShadow = true
    ball.receiveShadow = true
    balls.push(ball)
    scene.add(balls[0])

    // Light
    //  Point Light >>
    pointLight = new THREE.PointLight(0xffffff, 1, 800, 4)
    pointLight.position.set(0, 20, 0)
    pointLight.castShadow = true
    pointLight.shadow.camera.near = 1
    pointLight.shadow.camera.far = 200
    pointLight.intensity = 1
    scene.add(pointLight)

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
    //est
    ballBody.angularDamping = 0.3
    ballBody.position.set(-6, 5, 7)
    ballsBodys.push(ballBody)
    world.add(ballsBodys[0])

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

    //Bowling Balls
    balls[0].position.copy(ballsBodys[0].position)
    balls[0].quaternion.copy(ballsBodys[0].quaternion)
}

function render() {
    renderer.render(scene, camera)
    ballMove()
    camera.updateMatrixWorld()
}

var seconds_passed = 0
function onDocumentKeyDown(event) {
    if (event.keyCode == 13) {
        power++
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
    for (var j = 0; j < 10; j = j + 1) {
        if (pinArrayBody[j].position.z < -55) {
            scores = scores + 10
        }
    }
    console.log(scores)
    return scores
}

function ballMove() {
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
