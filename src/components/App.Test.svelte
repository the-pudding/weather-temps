<script>
  import { range, scaleBand } from "d3";
  import { LayerCake, Svg } from "layercake";
  // import { tweened } from "svelte/motion";
  import Column from "$components/charts/Column.svelte";
  import rawData from "$data/test.js";

  const position = "absolute";
  const x = "yearsAgo";
  const y = "count";
  const fill = "rgba(255,255,255,0.25)";
  const primary = "green";
  const secondary = "pink";
  const pad = 32;
  const padding = { top: pad, right: pad, bottom: pad, left: pad };

  const xScale = scaleBand().paddingInner([0.02]).round(true);

  let index = 0;
  let interval;
  const play = () => {
    interval = setInterval(() => {
      index += 1;
    }, 100);
  };

  const reset = () => {
    clearInterval(interval);
    index = 0;
  };

  const xDomain = range(rawData.length);
  xDomain.reverse();
  $: data = rawData[index];
  $: yDomain = [0, 50];
</script>

<button on:click={play}>Play</button>
<button on:click={reset}>Reset</button>
<h1>{1872 + index}</h1>
<figure>
  <LayerCake {padding} {x} {y} {xScale} {xDomain} {yDomain} {data}>
    <Svg>
      <Column />
    </Svg>
  </LayerCake>
</figure>

<style>
  h1 {
    text-align: center;
  }
  figure {
    max-width: 1280px;
    height: 75vh;
    margin: 4rem auto;
    overflow: hidden;
  }
</style>
