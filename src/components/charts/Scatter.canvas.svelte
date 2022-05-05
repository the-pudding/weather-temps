<script>
  import { getContext } from "svelte";
  import { scaleCanvas } from "layercake";

  const { data, xGet, yGet, width, height, xDomain, xScale } =
    getContext("LayerCake");

  const { ctx } = getContext("canvas");

  export let fill = "#ccc";
  export let stroke = "#000";
  export let strokeWidth = 0;
  export let w;
  export let h;

  $: if ($ctx) {
    scaleCanvas($ctx, $width, $height);
    $ctx.clearRect(0, 0, $width, $height);

    $data.forEach((d) => {
      $ctx.beginPath();
      const x = $xGet(d) - w;
      const y = $yGet(d) - h / 2;
      // if (d.day === 103 && d.highlight) console.log(x);
      $ctx.rect(x, y, w, h);
      $ctx.lineWidth = strokeWidth;
      $ctx.strokeStyle = stroke;
      $ctx.stroke();
      $ctx.fillStyle = d.fill ?? fill;
      $ctx.fill();
    });
  }
</script>
