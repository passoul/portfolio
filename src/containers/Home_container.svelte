<script>
	import Skills from "../components/skills/Skills.svelte";
	import Tools from "../components/tools/Tools.svelte";
	import Trust from "../components/trust/Trust.svelte";
	import Download from "../components/buttons/download/download.svelte";

    export let skillsData;
    export let toolsData;
    export let trustData;
    export let cvData;
    
</script>

<Skills {skillsData}/>
<Tools {toolsData}/>
<Trust {trustData}/>
<Download {cvData}/>