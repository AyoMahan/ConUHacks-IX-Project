<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    // Props
    export let imageURL = "";
    export let speed = 0.02;

    let images = [];
    let imageWidth = 0;
    let numImages = 0;
    let handles = [];

    function moveImg() {
        images = images.map((img) => {
            img.x -= speed;
            if (img.x <= -imageWidth) {
                img.x = imageWidth * (numImages - 1);
            }
            return img;
        });
    }

    function updateImageCount() {
        if (!browser) return;

        const img = new Image();
        img.src = imageURL;
        img.onload = () => {
            imageWidth = Math.ceil(img.width * (window.innerHeight / img.height)) - 1;

            // Calculate how many images are needed
            numImages = Math.ceil(window.innerWidth / imageWidth) + 1; // + 1 so we ensure we don't have empty pixels when looping
            images = Array.from({ length: numImages }, (_, i) => ({
                x: i * imageWidth,
            }));
        };
    }

    onMount(() => {
        updateImageCount();

        if (browser) {
            handles.push(setInterval(moveImg, 5));
            window.addEventListener("resize", updateImageCount);
        }
    });

    onDestroy(() => {
        if (browser) {
            handles.forEach(clearInterval);
            window.removeEventListener("resize", updateImageCount);
        }
    });
</script>

<div class="parallax">
    {#each images as img (img.x)}
        <div
            class="image"
            style="background-image: url({imageURL}); transform: translateX({Math.round(img.x)}px); width: {imageWidth + 1}px;"
        ></div>
    {/each}
</div>

<style>
    .parallax {
        z-index: -1;
        position: absolute;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        white-space: nowrap;
    }

    .image {
        position: absolute;
        height: 100vh;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        image-rendering: pixelated;
    }
</style>
