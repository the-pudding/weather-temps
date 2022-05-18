<script>
  import { range } from "d3";
  export let total;
  export let current;

  $: bars = range(total);
</script>

<div>
  {#each bars as i}
    {@const complete = i <= current}
    <span class:complete />
  {/each}
</div>

<style>
  div {
    position: fixed;
    top: 0.25rem;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--z-overlay);
    pointer-events: none;
    display: flex;
  }

  span {
    display: block;
    height: 0.25rem;
    background: var(--color-fg);
    opacity: 0.25;
    margin: 0 2px;
    flex: 1;
    transition: opacity 250ms;
  }

  span.complete {
    opacity: 0.65;
  }
</style>
