<script>
  import { getContext } from "svelte";
  import { scaleCanvas } from "layercake";

  const { data, xGet, yGet, z, width, height, xDomain, xScale } =
    getContext("LayerCake");

  const { ctx } = getContext("canvas");

  export let fill = "#ccc";
  export let stroke = "#000";
  export let strokeWidth = 0;
  export let filter = () => true;

  $: daysInView = $xDomain[1] - $xDomain[0] + 4;
  $: margin = daysInView <= 30 ? 2 : 0;
  $: w = Math.max(3, Math.floor($width / daysInView - margin));
  $: h = 3;
  $: renderData = $data.filter(filter);

  $: if ($ctx) {
    scaleCanvas($ctx, $width, $height);
    $ctx.clearRect(0, 0, $width, $height);

    renderData.forEach((d) => {
      $ctx.beginPath();
      const x = $xGet(d) - w / 2;
      const y = $yGet(d) - h / 2;
      $ctx.rect(x, y, w, h);
      $ctx.lineWidth = strokeWidth;
      $ctx.strokeStyle = stroke;
      $ctx.stroke();
      $ctx.fillStyle = d.fill ?? fill;
      $ctx.fill();
    });
  }
</script>
