import { Canvas } from '../objects/canvas';
import { glMatrix, mat4 } from 'gl-matrix';

export class Shader {
    constructor(config) {
        this.config = config;
        this.height = this.config.canvas.height;
        this.width = this.config.canvas.width;
        this.canvas_obj;
        this.context;
        this.canvas;
        this.shaderProgram;
    }

    async init() {
        // this.bind(this);
        this.canvas_obj = new Canvas;
        [this.canvas, this.context] = this.canvas_obj.create3dCanvas(['display'], this.width ,this.height);
        this.canvas_obj.addCanvas("#display", this.canvas);

        this.render();
    }

    render() {
        // Vertex Shader
        const vertexShader = this.createShader(this.context.VERTEX_SHADER, this.vertexShader());

        // Fragment Shader
        const fragmentShader = this.createShader(this.context.FRAGMENT_SHADER, this.fragmentShader());

        // Shader Program
        this.shaderProgram = this.createProgram(vertexShader, fragmentShader);

        // Buffer
        const positionBuffer = this.createBuffer();

        // Set up the scene
        const modelViewMatrix = mat4.create();
        const projectionMatrix = mat4.create();
        const cameraPosition = [0, 0, -5];
        const upVector = [0, 1, 0];
        const target = [0, 0, 0];
        mat4.lookAt(modelViewMatrix, cameraPosition, target, upVector);
        mat4.perspective(projectionMatrix, Math.PI / 4, this.canvas.width / this.canvas.height, 0.1, 100.0);

        // Lighting
        const lightPosition = [1.0, 1.0, -2.0];
        const lightColor = [1.0, 1.0, 1.0];

        // Use the shader program
        this.context.useProgram(this.shaderProgram);

        // Set up attributes and uniforms
        const positionAttribLocation = this.context.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.context.vertexAttribPointer(positionAttribLocation, 3, this.context.FLOAT, false, 0, 0);
        this.context.enableVertexAttribArray(positionAttribLocation);

        const uModelViewMatrix = this.context.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
        const uProjectionMatrix = this.context.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');

        this.context.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
        this.context.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

        // Set up lighting uniforms
        const uLightPosition = this.context.getUniformLocation(this.shaderProgram, 'uLightPosition');
        const uLightColor = this.context.getUniformLocation(this.shaderProgram, 'uLightColor');

        this.context.uniform3fv(uLightPosition, lightPosition);
        this.context.uniform3fv(uLightColor, lightColor);

        // Rendering
        this.drawScene();
    }

    vertexShader() {
        return `#version 300 es
            in vec4 aVertexPosition;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            out vec4 vColor;

            void main(void) {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;
    }

    fragmentShader() {
        return `#version 300 es
            precision mediump float;
            in vec4 vColor;
            out vec4 fragColor;

            void main(void) {
                fragColor = vColor;
            }
        `;
    }

    createShader(type, source) {
        const shader = this.context.createShader(type);
        this.context.shaderSource(shader, source);
        this.context.compileShader(shader);

        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.context.getShaderInfoLog(shader));
            this.context.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.context.createProgram();
        this.context.attachShader(program, vertexShader);
        this.context.attachShader(program, fragmentShader);
        this.context.linkProgram(program);

        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            console.error('Shader program linking error:', this.context.getProgramInfoLog(program));
            this.context.deleteProgram(program);
            return null;
        }

        return program;
    }

    createBuffer() {
        const vertices = new Float32Array([
            0.0,  1.0,  0.0,
           -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0,
        ]);

        const buffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, vertices, this.context.STATIC_DRAW);
    }

    drawScene() {
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        this.createBuffer();

        const primitiveType = this.context.TRIANGLES;
        const offset = 0;
        const count = 3;
        this.context.drawArrays(primitiveType, offset, count);
    }
}