<script>
  import { COPYRIGHT_DATA } from "../../store/data";

  export let copyrightClass;

  const { TEXT } = $COPYRIGHT_DATA;
</script>

<div class="{copyrightClass}">
  <p class="mt-3">{TEXT}</p>
</div>
