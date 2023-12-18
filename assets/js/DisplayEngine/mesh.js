export class Mesh {
    constructor(mesh){
        this.positions = mesh.positions;
        this.colors = mesh.colors;
        this.normals = mesh.normals;
        this.uvs = mesh.uvs;
        this.triangles = mesh.triangles;
    }

    set positions(val){
        this.positions = new Float32Array(val);
    }
    get positions(){
        return this.positions;
    }
    set colors(val) {
        this.colors = new Float32Array(val);
    }
    get colors(){
        return this.colors;
    }
    set normals(val) {
        this.normals = new Float32Array(val);
    }
    get normals(){
        return this.normals;
    }
    set uvs(val) {
        this.uvs = new Float32Array(val);
    }
    get uvs(){
        return this.uvs;
    }
    set triangles(val) {
        this.triangles = new Uint16Array(val);
    }
    get triangles(){
        return this.triangles;
    }
}