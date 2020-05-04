<script>
  import { Button } from "smelte";
  import Icon from "svelte-awesome";
  export let cvData = {};
  const { TITLE, BTNTEXT, URL } = cvData;
</script>

<div class="download-cv">
  <h1
    class=" w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 capitalize dark:text-gray-100"
  >
    {TITLE}
  </h1>
  <!-- <button
    class="cv-btn mx-auto lg:mx-0 hover:underline  text-gray-800 font-bold my-6 py-4 px-8"
  >
    <a href="{URL}">{TITLE}</a>
  </button> -->
  <div class="mx-auto lg:mx-0 my-6 py-4 px-8">
    <Button href="{URL}">{BTNTEXT}</Button>
  </div>
</div>
