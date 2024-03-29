//let socket = null;
let pixelsLoaded = false;

function connectSocket(){
    //socket = io(/*"https://pixelpex-api.glitch.me"*/);
    console.log("hello")

    socket.on("connect", () => {
        hideLoading();

        setTimeout(() => {
            showLogo();
        }, 500);

        getPixels();
    });

    socket.on("add_pixels", (pixelsToAdd) => {
        for (let x in pixelsToAdd){
            if (!pixels[x])
                pixels[x] = {};

            for (let y in pixelsToAdd[x]){
                pixels[x][y] = pixelsToAdd[x][y];
            }
        }

        draw();
    });

    socket.on("delete_pixels", (pixelsToDelete) => {
        for (let x in pixelsToDelete){
            if (!pixels[x])
                continue;

            for (let y in pixelsToDelete[x]){
                delete pixels[x][y];

                if (Object.keys(pixels[x]).length === 0)
                    delete pixels[x];
            }
        }

        draw();
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });
}

function getPixels(){
    socket.emit("get_pixels");

    socket.on("get_pixels", (pixelsToAdd) => {
        pixels = pixelsToAdd;
        console.log(pixels)
        draw();

        setInterval(() => {
            if (pixelsLoaded){
                hideIntro();
                return;
            }
        }, 600);

        pixelsLoaded = true;
    });
}

window.onload = () => {
    //socket = io()
    console.log("Loaded")
    connectSocket();
};