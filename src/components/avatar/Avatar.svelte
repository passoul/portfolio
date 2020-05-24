<script>
  import Image from "svelte-image";

  export let avatar = {};
  export let avatarClass;

  const { alt, src } = avatar;
</script>

<div class="avatar {avatarClass}">
  <Image src="static/images/avatar/avatar.png" {alt} />
</div>
<style>
  :global(header .avatar){
    width: 48px;
    height: 48px;
  }
  :global(.avatar){
    width: 128px;
    height: 128px;
  }
  :global(.avatar img){
    @apply rounded-full;
  }
</style>