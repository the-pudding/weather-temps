<script>
  import { getContext } from "svelte";
  import { scaleCanvas } from "layercake";

  const { data, xGet, yGet, z, width, height, xPadding, xDomain } =
    getContext("LayerCake");

  const { ctx } = getContext("canvas");

  export let fill = "#ccc";
  export let highlight = "#ccc";
  export let stroke = "#000";
  export let strokeWidth = 0;
  export let filter = () => true;

  $: daysInView = $xDomain[1] - $xDomain[0];
  $: margin = daysInView <= 30 ? 2 : 0;
  $: paddedWidth = $width - $xPadding[0] - $xPadding[1];
  $: w = Math.floor(paddedWidth / daysInView - margin);
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
      $ctx.fillStyle = fill;
      $ctx.fill();
    });
  }
</script>
