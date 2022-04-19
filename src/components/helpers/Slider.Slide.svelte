<script>
  import { getContext } from "svelte";
  const { direction, width, height } = getContext("Slider");

  export let center;
  $: w = $direction === "horizontal" ? `${$width}px` : "100%";
  $: h = $direction === "vertical" ? `${$height}px` : "100%";
</script>

<div class="slide" class:center style="width: {w}; height: {h};">
  <slot />
</div>

<style>
  .slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .slide.center {
    justify-content: center;
  }
</style>
