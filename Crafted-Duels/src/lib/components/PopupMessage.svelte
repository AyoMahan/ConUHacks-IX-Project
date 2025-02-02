<script>
    import { createEventDispatcher } from 'svelte';

    export let message="";
    
    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }
</script>

<div class="popup-container">
    {message}
    <div class="close-button" role="button" tabindex="0" on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && close()} on:click={close}>X</div>
</div>

<style>
    .popup-container{
        outline: 2px white solid;
    }

    .close-button {
        outline: 2px #FFDEAD solid;
        border-radius: 20px;
        width: 1em;
        height: 1em;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: rgba(214, 122, 9, 0.8);
        color: #FFDEAD;
    }

    .close-button:hover{
        background-color: #8a4f07;
        cursor: pointer;
    }
</style>