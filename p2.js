console.clear();

// ----------------------------------------------
// Axis data (do not modify)
// ----------------------------------------------

let A = [
    [0.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 1.0]
];

// ----------------------------------------------
// end axis data
// ----------------------------------------------

// ----------------------------------------------
// Simuation control (do not modify)
// ----------------------------------------------

let xang = 0;
let yang = 0;
let zang = 0;
let rot = 0;
let axisRotation = null;
let rot_inc = 10;

// store WebGL state for each canvas
const gl_contexts = {
    xz: null,
    yz: null,
    xy: null,
    xyz: null
};

// geometery arrays
let axisVertices = [];
let planeVertices = [];
let propVertices = [];

const PLANE_SCALE = 1.75;

function startRotation(rotationFunc) {
    if (axisRotation !== null) clearInterval(axisRotation);
    axisRotation = setInterval(rotationFunc, 100);
}

function stopRotation() {
    clearInterval(axisRotation);
    axisRotation = null;
}

document.addEventListener('mouseup', stopRotation);

document.addEventListener('mousedown', function (event) {
    switch ( event.target.id ) {
        case "pitch-up":
            startRotation(() => { xang = ( xang + rot_inc ) % 360; });
            break;
        case "pitch-down":
            startRotation(() => { xang = ( xang - rot_inc ) % 360; });
            break;
        case "roll-left":
            startRotation(() => { zang = ( zang + rot_inc ) % 360; });
            break;
        case "roll-right":
            startRotation(() => { zang = ( zang - rot_inc ) % 360; });
            break;
        case "yaw-left":
            startRotation(() => { yang = ( yang + rot_inc ) % 360; });
            break;
        case "yaw-right":
            startRotation(() => { yang = ( yang - rot_inc ) % 360; });
            break;
        case "reset":
            xang = yang = zang = 0; 
            break;
        default:
            stopRotation();
    }
});

// ----------------------------------------------
// End simuation control
// ----------------------------------------------

function configure() {
    let ids = ["xz", "yz", "xy", "xyz"];

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        let canvas = document.getElementById(id);
        let webgl_context = canvas.getContext("webgl");
    

        let program = initShaders(webgl_context, "vertex-shader", "fragment-shader");
        webgl_context.useProgram(program);

        webgl_context.viewport(0,0,canvas.width, canvas.height);

        let attr_vertex = webgl_context.getAttribLocation(program, "vertex");
        let uniform_color = webgl_context.getUniformLocation(program, "color");
        let uniform_view = webgl_context.getUniformLocation(program, "View");
        let uniform_model = webgl_context.getUniformLocation(program, "Model");

        webgl_context.enable( webgl_context.DEPTH_TEST );

        gl_contexts[id] = {
            id,
            canvas,
            webgl_context,
            program,
            attr_vertex,
            uniform_color,
            uniform_view,
            uniform_model
        };
    }
}

function createVertexData() {
    let row;
    // axes (A); just an array of [x, y, z] points, so copy directly
    axisVertices = [];
    row = 0;

    for (let i = 0; i < A.length; i++) {
        axisVertices[row++] = A[i];
    }
    
    // plane (Vpl, Fpl); list of vertices (Vpl) and faces (Fpl), for each face copy the 3 vertices
    planeVertices = [];
    row = 0;

    for (let i = 0; i < Fpl.length; i++) {
        const F = Fpl[i];

        planeVertices[row++] = Vpl[F[0]];
        planeVertices[row++] = Vpl[F[1]];
        planeVertices[row++] = Vpl[F[2]];
    }


    // propeller (Vpp, Fpp); same idea as plane
    propVertices = [];
    row = 0;

    for (let i = 0; i < Fpp.length; i++) {
        const F = Fpp[i];

        propVertices[row++] = Vpp[F[0]];
        propVertices[row++] = Vpp[F[1]];
        propVertices[row++] = Vpp[F[2]];
    }

    // will need to call flatten before uploading to WebGL
}


createVertexData();
//configure();
//allocateMemory();
//draw();