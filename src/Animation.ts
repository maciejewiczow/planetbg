import { AmbientLight, DirectionalLight, Group, ImageUtils, LinearFilter, MeshLambertMaterial, PerspectiveCamera, Scene, WebGLRenderer, Vector2 } from "three";
import { AsteroidGroup } from "./AsteroidGroup";
import { Planet } from "./Planet";
import { Starfield } from "./Starfield";

export const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

export class Animation {
    private static CAM_INIT_Z = 550;

    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: PerspectiveCamera;

    private system: Group;
    private planet: Planet;
    private asteroids: AsteroidGroup;

    private frames = 0;
    private measureInerval?: number;
    private measureFPS = false;

    private mouse = new Vector2();
    private scrolDelta = 0;

    /**
     * Creates an instance of Animation.
     *
     * All animation setup happens here
     * @param {HTMLElement} container - element into witch the canvas will be inserted
     * @memberof Animation
     */
    constructor(container: HTMLElement, fpsTarget?: HTMLElement) {
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseScroll = this.handleMouseScroll.bind(this);
        this.onResize = this.onResize.bind(this);

        this.renderer = this.getRenderer(container);
        this.scene = new Scene();
        this.camera = this.getCamera();
        this.setLights();
        this.asteroids = this.getAsteroids();
        this.planet = this.getPlanet();
        this.system = this.getSystem();

        this.scene.add(this.system);
        this.scene.add(this.getStars());

        if (fpsTarget) {
            this.measureFPS = true;
            this.measureInerval = setInterval(() => {
                fpsTarget.innerText = this.frames + " fps";
                this.frames = 0;
            }, 1000);
        }
    }

    private getRenderer(el: HTMLElement): WebGLRenderer {
        const renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        el.appendChild(renderer.domElement);
        return renderer;
    }

    private getCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );
        camera.position.z = Animation.CAM_INIT_Z;
        this.scene.add(camera);
        return camera;
    }

    private setLights(): void {
        this.scene.add(new AmbientLight(0xffffff, 0.15));

        const light = new DirectionalLight(0xffffff, 1.2);
        light.position.set(2500, 2500, 1500);
        this.scene.add(light);
    }

    private getPlanet() {
        const texture = ImageUtils.loadTexture("assets/face.png");
        texture.minFilter = texture.magFilter = LinearFilter;

        const material = new MeshLambertMaterial({
            color: 0xffcb4c,
            map: texture
        });

        return new Planet(0.035, material);
    }

    private getAsteroids() {
        return new AsteroidGroup(new MeshLambertMaterial({ color: 0xffcb4c }), {
            spread: 60,
            roughness: 1.1,
            maxSize: 12,
            radius: 320
        });
    }

    private getSystem() {
        const sys = new Group();
        sys.add(this.asteroids);
        sys.add(this.planet);
        sys.rotation.x = 0.2;
        sys.rotation.z = 0.1;
        return sys;
    }

    private getStars() {
        return new Starfield({
            count: 150,
            radius: 2000,
            zSpread: 0,
            brightness: 0.65
        });
    }

    animate() {
        if (this.measureFPS) this.frames++;
        this.renderer.render(this.scene, this.camera);

        this.planet.update();
        this.asteroids.update();

        const ratio = 0.0002;

        let x = this.mouse.x;
        let y = this.mouse.y;

        x *= ratio;
        y *= ratio;

        const h = Math.PI * 1.5;
        const w = 1;

        const sigmoid = (x: number) => (1 / (1 + Math.exp(-x / w))) * h - h / 2;

        const lerpFactor = 0.08

        this.camera.position.x = lerp(this.camera.position.x, Animation.CAM_INIT_Z * Math.sin(sigmoid(x)), lerpFactor);
        this.camera.position.z = lerp(this.camera.position.z, Animation.CAM_INIT_Z * Math.cos(sigmoid(y)), lerpFactor);
        this.camera.position.y = lerp(this.camera.position.y, Animation.CAM_INIT_Z * Math.sin(sigmoid(-y)), lerpFactor);
        this.camera.lookAt(this.system.position);

        requestAnimationFrame(this.animate.bind(this));
    }

    handleMouseMove(e: MouseEvent) {
        this.mouse.x = e.clientX - window.innerWidth / 2;
        this.mouse.y = e.clientY - window.innerHeight / 2;
    }

    handleMouseScroll(e: WheelEvent) {
         // cross-browser wheel delta
        e = window.event as WheelEvent || e; // old IE support
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        delta *= 0.05;

        this.asteroids.setRotationSpeed(lerp(this.scrolDelta, delta, 0.001));
        this.scrolDelta = delta;
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
