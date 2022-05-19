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
    top: 0.5rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: calc(100% - 0.5rem);
    height: 100%;
    z-index: var(--z-overlay);
    pointer-events: none;
    display: flex;
  }

  span {
    display: block;
    height: 2px;
    background: var(--color-fg);
    opacity: 0.5;
    margin: 0 2px;
    flex: 1;
    transition: opacity 250ms;
    border-radius: 10px;
  }

  span.complete {
    opacity: 1;
  }
</style>
