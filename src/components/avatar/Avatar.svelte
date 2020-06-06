<script>
  import Image from "svelte-image";
  import { PROFIL_DATA } from "../../store/data.js";

  export let avatarClass;
  export let position;

  const { alt, src } = $PROFIL_DATA.AVATAR;
</script>

<div class="avatar {avatarClass} {position == 'header' ? 'w-12 h-12' : 'w-32 h-32'}">
  <Image src="static/images/avatar/avatar.png" {alt} />
</div>
<style>
  :global(.avatar img){
    @apply rounded-full;
  }
</style>