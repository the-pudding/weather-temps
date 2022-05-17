<script>
  import { ascending } from "d3";
  import Title from "$components/Title.svelte";
  import Icon from "$components/Helpers/Icon.svelte";

  export let location;
  export let data;
  let visible;

  data.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));
</script>

<button class="view" on:click={() => (visible = true)}
  >View Last Five Records</button
>

<div class="outer" on:click={() => (visible = false)} class:visible>
  <div class="inner">
    <Title hed={location} dek="Recent Daily Record-Highs" />
    <table>
      <thead>
        <th>Year</th>
        <th>Date</th>
        <th>Temp.</th>
      </thead>
      <tbody>
        {#each data as { formattedDate, rawDate, temp }}
          {@const year = rawDate.substring(0, 4)}
          {@const displayTemp = `${temp}°F`}
          <tr>
            <td>{year}</td>
            <td>{formattedDate}</td>
            <td>{displayTemp}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <button class="close" on:click={() => (visible = false)}
    ><Icon name="x" strokeWidth="2px" /></button
  >
</div>

<style>
  button.view {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -100%);
    z-index: var(--z-overlay);
    background: var(--color-gray-700);
    color: var(--color-fg-alt);
    text-transform: uppercase;
  }

  button.close {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: var(--z-overlay);
    background: none;
    color: var(--color-fg);
    line-height: 1;
    font-size: 2rem;
    border-radius: 0;
    transform: translate(0, -5vh);
  }

  .outer {
    position: absolute;
    top: 5%;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    z-index: var(--z-overlay);
    background: var(--color-bg);
    padding: 1rem;
  }

  .inner {
    max-width: 960px;
    padding: 0 1rem;
    margin: 0 auto;
  }

  .visible {
    display: block;
  }

  table {
    font-family: var(--sans);
    margin-top: 2rem;
  }

  td:first-of-type,
  th:first-of-type {
    padding-left: 1rem;
  }

  td:last-of-type,
  th:last-of-type {
    padding-right: 1rem;
    text-align: right;
  }

  @media only screen and (min-width: 640px) {
    button.view {
      top: 65%;
    }
  }
</style>
