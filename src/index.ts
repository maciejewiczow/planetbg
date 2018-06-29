import { Animation } from './Animation';


const app = new Animation(
    // @ts-ignore
    document.getElementById("root"),
    document.getElementById("framerate")
);
app.animate();

document.addEventListener("mousemove", app.handleMouseMove);
document.addEventListener("mousewheel", app.handleMouseScroll);
document.addEventListener("DOMMouseScroll", app.handleMouseScroll);
window.addEventListener("resize", app.onResize);