<script>
    import { createEventDispatcher } from "svelte";

    export let message = "";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }
</script>

<div class="popup-container">
    {message}
    <div
        class="close-button"
        role="button"
        tabindex="0"
        on:keydown={(e) => (e.key === "Enter" || e.key === " ") && close()}
        on:click={close}
    >
        X
    </div>
</div>

<style>
    .popup-container {
        position: absolute;
        color: antiquewhite;
        border: 2px white solid;
        background-color: rgb(164, 63, 9);
        border-radius: 30px;
        max-width: 100%;
        min-height: 40%;
        width: 50%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: auto;
    }

    .close-button {
        position: absolute;
        top: 10px; 
        right: 10px; 
        outline: 2px #ffdead solid;
        border-radius: 20px;
        width: 1em;
        height: 1em;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: rgba(214, 122, 9, 0.8);
        color: #ffdead;
    }

    .close-button:hover {
        background-color: #8a4f07;
        cursor: pointer;
    }
</style>
