<script>
  import { PROFIL_DATA } from "../../store/data";

  const { PROFESSION, FIRSTNAME, LASTNAME } = $PROFIL_DATA;
</script>

<div class="profession w-full">
  <h1 class="my-4 text-2xl font-bold leading-tight capitalize">{PROFESSION}</h1>
  <p class="leading-normal text-lg mb-4 capitalize">{FIRSTNAME} {LASTNAME}</p>
</div>
