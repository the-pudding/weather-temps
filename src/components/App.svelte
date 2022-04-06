<script>
  import WIP from "$components/helpers/WIP.svelte";
  import { max, timeFormat, ascending } from "d3";
  import { LayerCake, Svg } from "layercake";
  import Line from "$components/charts/Line.svelte";
  import Scatter from "$components/charts/Scatter.svg.svelte";
  import AxisY from "$components/charts/AxisY.svg.svelte";
  import bosData from "$data/bos.js";

  const x = "day";
  const y = "temp";
  const z = "rank";
  const yMax = max(bosData.records, (d) => d.temp);
  const yDomain = [0, yMax];
  const position = "absolute";

  const rankNames = ["", "2nd ", "3rd ", "4th "];

  let days;
  let rank;
  let date;
  let count;
  let countTop;
  let data;

  const update = () => {
    let found = false;
    bosData.records.forEach((d, i) => {
      d.highlight = false;
      if (step === 0) d.highlight = i === 0;
      else if (step === 1) {
        if (found) d.highlight = false;
        else if (d.rank === 0) {
          d.highlight = true;
          found = true;
        }
      } else if (step === 2) d.highlight = d.daysSinceNow < 365;
      else d.highlight = true;
    });

    const first = bosData.records.find((d) => d.highlight);
    days = first.daysSinceNow;
    rank = rankNames[first.rank];
    date = timeFormat("%B %e")(first.date);
    count = bosData.records.filter((d) => d.highlight).length;
    countTop = bosData.records.filter((d) => d.highlight && d.rank === 0).length;
    data = bosData;
    data.records.sort((a, b) => ascending(a.highlight, b.highlight));
  };

  let step = 0;

  $: update(step);
</script>

<WIP />

<section>
  <button on:click={() => (step += 1)}>Next</button>
  <p class:visible={step === 0}>
    Yesterday wasn't a heat record for Boston, but just {days} days ago it was the {rank} hottest
    {date} ever.
  </p>

  <p class:visible={step === 1}>
    And we only have to go back {Math.floor(days / 7)} weeks to find the hottest day record: {date}.
  </p>

  <p class:visible={step === 2}>
    In the last year alone, {count} days hit a top four daily temperature, including {countTop} daily
    records.
  </p>

  <p class:visible={step === 3}>
    Here are all the top four daily temperatures in the last 150 years.
  </p>
</section>
<figure>
  <LayerCake data={data.averages} {position} {x} {y} {z} {yDomain}>
    <Svg>
      <Line />
    </Svg>
  </LayerCake>

  <LayerCake data={data.records} {position} {x} {y} {z} {yDomain}>
    <Svg>
      <AxisY />
      <Scatter fill="pink" showText={step < 2} />
    </Svg>
  </LayerCake>
</figure>

<style>
  section {
    max-width: 40rem;
    margin: 0 auto;
    font-size: 1.5em;
  }

  figure {
    margin: 0 auto;
    max-width: 90%;
    width: 100%;
    height: 75vh;
    position: relative;
  }

  p {
    display: none;
  }

  p.visible {
    display: block;
  }
</style>
