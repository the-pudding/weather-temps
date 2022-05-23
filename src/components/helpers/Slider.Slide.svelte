<script>
  import { getContext } from "svelte";
  import canTab from "$actions/canTab.js";
  const { dir, cur, w, h } = getContext("Slider");

  export let index;

  $: width = $dir === "horizontal" ? `${$w}px` : "100%";
  $: height = $dir === "vertical" ? `${$h}px` : "100%";
  $: visible = index === $cur;
  $: disable = !visible;
</script>

<section
  class="slide"
  class:visible
  style:width
  style:height
  use:canTab={{ disable }}
>
  <slot />
</section>

<style>
  section {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;
    line-height: 1.2;
  }

  :global(.subtext) {
    font-family: var(--sans);
    font-size: 1rem;
    line-height: 1.4;
  }

  @media only screen and (min-width: 640px) {
    section {
      font-size: 1.5rem;
    }

    :global(.subtext) {
      font-size: 1.125rem;
    }
  }

  @media only screen and (min-width: 1024px) {
    section {
      font-size: 2rem;
    }
    :global(.subtext) {
      font-size: 1.25rem;
    }
  }
</style>
