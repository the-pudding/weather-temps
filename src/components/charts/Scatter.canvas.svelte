<script>
  import { getContext } from "svelte";
  import { scaleCanvas } from "layercake";

  const { data, xGet, yGet, width, height, xDomain, xScale } =
    getContext("LayerCake");

  const { ctx } = getContext("canvas");

  const { color } = getContext("App");

  export let fill = "#ccc";
  export let stroke = "#000";
  export let strokeWidth = 0;
  export let w;
  export let h;
  // export let opacity = 1;

  $: if ($ctx) {
    scaleCanvas($ctx, $width, $height);
    $ctx.clearRect(0, 0, $width, $height);

    // $ctx.globalAlpha = opacity;

    $data.forEach((d) => {
      $ctx.beginPath();
      const x = $xGet(d) - w;
      const y = $yGet(d) - h / 2;
      $ctx.rect(x, y, w, h);

      

      $ctx.fillStyle = d.fill ?? fill;
      $ctx.fill();

      if (d.fill !== color.default) {
        $ctx.beginPath();
        $ctx.lineWidth = 1;
        $ctx.strokeStyle = d.fill;
        $ctx.moveTo(x, y - .25);
        $ctx.lineTo(x + w, y - .25);
        $ctx.stroke()

        $ctx.beginPath();
        $ctx.lineWidth = 1;
        $ctx.strokeStyle = d.fill;
        $ctx.moveTo(x, y + h + .25);
        $ctx.lineTo(x + w, y + h + .25);
        $ctx.stroke();
      }
    });
  }
</script>
