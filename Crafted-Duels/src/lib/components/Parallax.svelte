<script>
    import ScrollingImg from "$lib/components/ScrollingImg.svelte";

    // Props
    export let imageURLs = [];
    export let speeds = [];
</script>

<div class="bg">
    {#each imageURLs as imageURL, index}
        <ScrollingImg {imageURL} speed={speeds[index]} />
    {/each}
</div>

<style>
</style>
