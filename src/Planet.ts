import { IcosahedronGeometry, Material, Mesh } from "three";
import { SimplexNoise } from 'three/examples/js/SimplexNoise';

export const simplex = new SimplexNoise();

export class Planet extends Mesh {

    constructor(roughness: number, material: Material) {
        const geometry = new IcosahedronGeometry(150, 3);

        geometry.vertices.forEach(x => x.multiplyScalar(0.95 + simplex.noise(x.x, x.y)*roughness))
        geometry.computeFlatVertexNormals()

        super(geometry, material);

        this.rotation.y = 1.5
    }

    update() {
        this.rotation.y -= 0.0005;
        this.rotation.z -= 0.001;
    }
}
