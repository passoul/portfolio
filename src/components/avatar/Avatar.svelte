<script>
  import { Image } from "smelte";
  export let avatar = {};
  export let avatarClass;
  export let widthHeight;
  const { alt, src } = avatar;
</script>

<div class="avatar {avatarClass}">
  <Image {alt} {src} class="rounded-full" width={widthHeight} height={widthHeight} />
</div>
