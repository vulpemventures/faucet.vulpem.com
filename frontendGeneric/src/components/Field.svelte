<script>
  export let labelFor;
  export let label;
</script>

<div class="field">
  <label for={labelFor} class="label has-text-white">{label}</label>
  <div class="control">
    <slot />
  </div>
</div>
