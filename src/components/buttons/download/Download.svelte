<script>
  import { CV_DATA } from "../../../store/data";
  import Icon from "svelte-awesome";
  import { Button } from "smelte";
  import { download } from "svelte-awesome/icons";
  import SectionTitle from "../../heading/SectionTitle.svelte";

  const { NAME, TITLE, BTNTEXT, URL } = $CV_DATA;
</script>

<div class="cv-content">
  <SectionTitle sectionTitle="{TITLE}" />
  <div class="mx-auto flex justify-center my-6 py-4 px-8">
    <Button href="{URL}" remove="font-medium" add="flex flex-wrap text-black">
      <Icon data="{download}" scale="1.2"></Icon>
      <div class="ml-2">
        {BTNTEXT}
      </div>
    </Button>
  </div>
</div>
