<script>
  import { getContext } from "svelte";
  import { ascending, descending, max, groups, range, scaleLinear } from "d3";

  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const { color, heatmapData } = getContext("App");

  const maxRecords = max(heatmapData, (d) => d.records);
  const scale = scaleLinear().domain([0, maxRecords]);

  const years = groups(heatmapData, (d) => d.year);

  years.forEach(([year, months]) => months.sort((a, b) => ascending(a.month)));

  years.sort((a, b) => descending(a[0], b[0]));
  const data = years.map(([year, m]) => {
    const months = range(12).map((i) => {
      const match = m.find((v) => v.month === i);
      return match ? match.records : 0;
    });
    return {
      year,
      months
    };
  });
</script>

<div>
  <table>
    <thead>
      <th />
      {#each names as name, i}
        <th data-name={name} />
      {/each}
    </thead>
    {#each data as { year, months }}
      <tbody>
        <tr>
          <td class="year">{year}</td>
          {#each months as record, i}
            {@const opacity = scale(record)}
            {@const dark = opacity > 0.65}
            <td class="month">
              <span class="bg" style:opacity />
              <span class="fg" class:dark>{record || ""}</span>
            </td>
          {/each}
        </tr>
      </tbody>
    {/each}
  </table>
</div>

<style>
  div {
    padding: 1rem;
  }

  table {
    font-family: var(--sans);
    table-layout: auto;
    font-size: 14px;
    max-width: 640px;
    margin: 4rem auto 0 auto;
  }

  th {
    text-align: center;
  }

  thead {
    border: none;
  }

  th {
    border-bottom: 1px solid currentColor;
  }

  td {
    border: 1px dashed white;
    text-align: center;
    padding: 0;
  }

  th,
  td {
    width: 1em;
    position: relative;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    background-color: var(--color-secondary);
  }

  .fg {
    position: relative;
  }

  .dark {
    color: var(--color-bg);
  }

  th:first-of-type {
    visibility: visible;
    border: none;
  }

  td:first-of-type {
    min-width: 2.5em;
    max-width: 2.5em;
    width: 2.5em;
    padding-right: 0.5rem;
    border: none;
    text-align: right;
  }

  th:before {
    content: attr(data-name);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -75%);
    display: none;
  }

  th:nth-of-type(3n - 1):before {
    display: block;
  }

  @media only screen and (min-width: 640px) {
    td {
      padding: 0.25rem 0;
      width: 2.25rem;
    }

    th:before {
      display: block;
    }
  }
</style>
