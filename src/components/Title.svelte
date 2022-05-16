<script>
  export let hed;
  export let dek;
</script>

<div>
  <p class="hed">{hed}</p>
  <p class="dek">{dek}</p>
</div>

<style>
  div {
    margin-top: 2rem;
    padding: 0 1rem;
    font-family: var(--sans);
    text-transform: uppercase;
    transform: translate(0, -100%);
  }

  p {
    margin: 0;
  }

  .hed {
    color: var(--color-fg-alt);    
  }

  @media only screen and (max-width: 475px) {
    p {
      font-size: 0.9em;
    }
  }
</style>
