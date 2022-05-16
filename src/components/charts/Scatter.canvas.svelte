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
      
      if(d.fill != "rgba(200,200,200,0.3)") {
        $ctx.lineWidth = 0;
        $ctx.strokeStyle = d.fill;
        $ctx.stroke();
      }
      
      
      
      $ctx.fillStyle = d.fill ?? fill;
      $ctx.fill();
    });
  }
</script>
