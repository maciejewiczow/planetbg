import { Material, Mesh, IcosahedronGeometry, Math as TMath } from "three";

export class Planet extends Mesh {

    constructor(roughness: number, material: Material) {
        const geometry = new IcosahedronGeometry(150, 3);

        geometry.vertices.forEach(x => x.multiplyScalar(0.95 + TMath.randFloatSpread(roughness)))
        geometry.computeFlatVertexNormals()

        super(geometry, material);

        this.rotation.y = 1.5
    }

    update() {
        this.rotation.y -= 0.0005;
        this.rotation.z -= 0.001;
    }
}
