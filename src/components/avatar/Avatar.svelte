<script>
  export let avatar = {};
  const { alt, src } = avatar;
  export let rounded = true;
</script>

<div class="avatar">
  <img class="{rounded ? 'rounded-full' : '' } object-center" {alt} {src} />
</div>

<style></style>
