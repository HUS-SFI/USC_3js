var width = window.innerWidth
var height = window.innerHeight
var camera, renderer, scene
var spotLight

//physics
var surfaceMesh, ball, table
var pin
var mass,
    world,
    timeStep = 1 / 60

var time

var balls = []

var power = 0

init()

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