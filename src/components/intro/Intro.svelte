<script>
  import { fade } from "svelte/transition";
  import { INTRO_DATA } from "../../store/data";
</script>

<div
  class="lg:py-4 mt-8 lg:mt-10 mx-3 text-white bg-black rounded px-4"
  in:fade
>
  {@html $INTRO_DATA.TEXT}
</div>
