import { Geometry, Group, Math as TMath, Points, PointsMaterial, Vector3 } from "three";

interface StarfieldSettings {
    count: number
    radius: number
    zSpread?: number
    brightness?: number
    size?: number
}

export class Starfield extends Group {
    constructor({radius, count, zSpread = 500, brightness = 0.5, size = 10}: StarfieldSettings ) {
        super();

        for (let j = 0; j < 10; j++) {
            const geom = new Geometry();
            const mat = new PointsMaterial({size: Math.random()*size});
            const stars = new Points(geom, mat);
            
            for (let i = 0; i < count; i++) {
                const vert = new Vector3();

                const r = radius + TMath.randFloatSpread(zSpread)

                const z = TMath.randFloatSpread(4 * r)
                const angle = TMath.randFloat(0, Math.PI * 2)
                const rprim = Math.sqrt(Math.abs(r * r - z * z));

                const x = rprim * Math.cos(angle);
                const y = rprim * Math.sin(angle);

                vert.set(x,y,z);
                
                // @ts-ignore
                stars.geometry.vertices.push(vert);
                mat.color.setScalar(TMath.randFloat(0, brightness));
            }
            this.add(stars);
        }
    }
}