<script>
  import { Button } from "smelte";
  import Icon from "svelte-awesome";
  import { download } from "svelte-awesome/icons";

  export let cvData = {};
  const { TITLE, BTNTEXT, URL } = cvData;
</script>

<div class="download-cv">
  <h1
    class=" w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 capitalize dark:text-gray-100"
  >
    {TITLE}
  </h1>
  <div class="mx-auto flex justify-center my-6 py-4 px-8">
    <Button
      href="{URL}"
      remove="font-medium bg-primary-500 hover:bg-primary-400"
      add="flex flex-wrap bg-custom text-black"
    >
      <Icon data="{download}" scale="1.2"></Icon>
      <div class="ml-2">
        {BTNTEXT}
      </div>
    </Button>
  </div>
</div>
