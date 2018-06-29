import { Animation } from "./Animation";

function detectWebGLContext() {
    // Create canvas element. The canvas is not added to the
    // document itself, so it is never displayed in the
    // browser window.
    const canvas = document.createElement("canvas");
    // Get WebGLRenderingContext from canvas element.
    const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // Report the result.
    return gl && gl instanceof WebGLRenderingContext;
}

if (detectWebGLContext()) {
    const content = document.getElementById("page-content");
    if (content) {
        content.style.backgroundImage = "none";
        content.style.backgroundColor= "transparent";
    }

    const app = new Animation(
        // @ts-ignore
        document.getElementById("planet-background-root"));

    document.addEventListener("mousemove", app.handleMouseMove);
    window.addEventListener("scroll", app.handleMouseScroll);
    window.addEventListener("resize", app.onResize);

    setTimeout(() => app.animate(), 500);
}
