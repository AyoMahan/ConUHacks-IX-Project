<script>
    import ScrollingImg from "$lib/components/ScrollingImg.svelte";

    // Props
    export let imageURLs = [];
    export let speeds = [];
</script>

{#each imageURLs as imageURL, index}
    <ScrollingImg {imageURL} speed={speeds[index]} />
{/each}

<style>
</style>
