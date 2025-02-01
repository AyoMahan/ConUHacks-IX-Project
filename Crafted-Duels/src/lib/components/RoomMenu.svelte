<script>
    import Player from "./Player.svelte";

</script>
<div class=room-menu-component>
    <div class="top-menu">
        <input value={playerName}/>
    </div>
    <div class="bottom-menu">
        {Player}
        <div class="seperator">
            vs
        </div>
        {Player}
    </div>
</div>