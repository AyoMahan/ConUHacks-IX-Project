<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function click() {
        dispatch('click');
    }

</script>

<button class="rules-btn" on:click={click}>
    <p>?</p>
</button>

<style>
    .rules-btn {
        border: 2px #FFDEAD solid;
        border-radius: 20px;
        width: 3em;
        height: 3em;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: rgba(214, 122, 9, 0.8);
        color: #FFDEAD;
    }

    .rules-btn:hover{
        background-color: #8a4f07;
        cursor: pointer;
    }

    p {
        font-size: 44px;
    }
</style>
