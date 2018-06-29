import { Animation } from './Animation';


const app = new Animation(
    // @ts-ignore
    document.getElementById("root"),
    document.getElementById("framerate")
);
app.animate();

document.addEventListener("mousemove", app.handleMouseMove);
window.addEventListener("scroll", app.handleMouseScroll)
window.addEventListener("resize", app.onResize);