<script>
  import Image from "svelte-image";
  import { PROFIL_DATA } from "../../store/data.js";

  export let avatarClass;

  const { alt, src } = $PROFIL_DATA.AVATAR;
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