<script>
  import Icon from "$components/helpers/Icon.svelte";
  import { tableData, tableTitle, tableVisible } from "$stores/misc.js";
  let visible;

  $: data = $tableData;
  $: columns = data ? Object.keys($tableData[0]).map((d) => d) : [];
  $: $tableVisible = visible;
</script>

{#if data}
  <div class="outer" class:visible>
    <div class="wrapper">
      <h3>{$tableTitle}</h3>
      <table>
        <thead>
          {#each columns as col}
            <th>{col}</th>
          {/each}
        </thead>
        <tbody>
          {#each data as d}
            <tr>
              {#each columns as col}
                <td>{d[col]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <button on:click={() => (visible = false)} aria-label="Close"
      ><Icon strokeWidth="2px" name="x" /></button
    >
  </div>
  <button on:click={() => (visible = true)} aria-label="View Data as Table"
    ><Icon strokeWidth="2px" name="table" /></button
  >
{/if}

<style>
  button {
    position: absolute;
    top: 2.25rem;
    right: 1.5rem;
    padding: 0;
    line-height: 1;
    font-size: 1.5rem;
    background-color: transparent;
    z-index: var(--z-overlay);
    pointer-events: all;
    color: currentColor;
  }

  h3 {
    text-transform: uppercase;
    font-family: var(--sans);
    font-size: 1rem;
    max-width: 40rem;
    margin: 2rem auto;
  }

  .outer {
    --offset: 0;
    display: none;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: calc(var(--z-overlay) + 2);
    background: var(--color-bg);
  }

  .visible {
    display: block;
    pointer-events: all;
    overflow: hidden;
  }

  .wrapper {
    height: 100%;
    overflow-y: scroll;
    padding: 3rem 1rem;
  }

  table {
    max-width: 40rem;
    margin: 0 auto;
    font-family: var(--sans);
  }
</style>
