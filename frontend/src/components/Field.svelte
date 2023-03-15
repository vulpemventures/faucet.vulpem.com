<script>
  export let classes;
  export let labelFor;
  export let label;
</script>

<div class={`field ${classes}`}>
  <label for={labelFor} class="label is-hidden">{label}</label>
  <div class="control">
    <slot />
  </div>
</div>
