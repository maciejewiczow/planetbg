import { Group, IcosahedronGeometry, Material, Math as TMath, Mesh } from "three";

interface AsteroidGroupSettings {
    radius: number
    maxSize: number
    roughness: number
    spread: number
}

export class AsteroidGroup extends Group {
    private minRotV = 0.003;
    private rotV = 0;
    private acc = 0;

    constructor(material: Material, { radius, maxSize, roughness, spread }: AsteroidGroupSettings) {
        super();
        
        for (let i = 0; i < Math.PI * 2; i += TMath.randFloat(0, 0.15)) {
            const asteroid = new Asteroid(Math.random() * maxSize, roughness, material);

            const offset = TMath.randFloatSpread(spread);
            asteroid.position.set(radius*Math.sin(i) + offset, offset, radius*Math.cos(i) + offset);

            this.add(asteroid);
        }
    }

    setAccSpeed(a: number) {
        this.acc = a;
    }

    update() {
        this.rotV += this.acc;
        this.acc *= 0.9
        this.rotV *= 0.99;
        this.rotation.y += this.minRotV + this.rotV;
    }
}

class Asteroid extends Mesh {
    constructor(size: number, roughness: number, material: Material) {
        const geometry = new IcosahedronGeometry(size, 0);

        geometry.vertices.forEach(x => x.multiplyScalar(TMath.randFloatSpread(roughness) + 0.8));
        geometry.computeFlatVertexNormals();

        super(geometry, material);
    }
}