<script>
  import { getContext } from "svelte";
  import {
    ascending,
    descending,
    extent,
    max,
    groups,
    range,
    scaleLinear
  } from "d3";

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

  const [minYear, maxYear] = extent(years, (d) => d[0]);
  const allYears = years.map((d) => d[0]);

  years.forEach(([year, months]) => months.sort((a, b) => ascending(a.month)));

  range(minYear, maxYear + 1).forEach((y) => {
    if (!allYears.includes(y)) years.push([y, []]);
  });

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

<div class="table">
  <div class="thead">
    <div class="tr">
      <span class="th year" />
      {#each names as name, i}
        <span class="th"><span class="name">{name}</span></span>
      {/each}
    </div>
  </div>
  <div class="tbody">
    {#each data as { year, months }}
      <div class="tr">
        <span class="td year">{year}</span>
        {#each months as record, i}
          {@const opacity = scale(record)}
          {@const dark = opacity > 0.65}
          <span class="td">
            <span class="bg" style:opacity />
            <span class="fg" class:dark>{record || ""}</span>
          </span>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .table {
    padding: 1rem;
    font-family: var(--sans);
    font-size: 14px;
    max-width: 640px;
    margin: 6rem auto 0 auto;
  }

  .tr {
    display: flex;
    width: 100%;
  }

  .td,
  .th {
    display: block;
    text-align: center;
    flex: 1;
    position: relative;
    padding: 0.25rem 0;
  }

  .th {
    border: 0.5px solid transparent;
  }

  .td {
    border: 0.5px dashed white;
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

  .td.year,
  .th.year {
    padding-right: 0.5rem;
    border: none;
    text-align: right;
  }

  .th .name {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
  }

  .th:nth-of-type(3n - 1) .name {
    visibility: visible;
  }

  @media only screen and (min-width: 640px) {
    .th .name {
      visibility: visible;
      transform: translate(-50%, -50%);
    }

    .td,
    .th {
      padding: 0.5rem 0;
    }
  }
</style>
