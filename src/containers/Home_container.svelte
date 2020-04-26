<script>
	import Avatar from "../components/avatar/Avatar.svelte";
	import Profil from "../components/heading/Profil.svelte";
	import Social from "../components/buttons/social/Social.svelte";
	import Skills from "../components/skills/Skills.svelte";
	import Tools from "../components/tools/Tools.svelte";
	import Trust from "../components/trust/Trust.svelte";
	import Download from "../components/buttons/download/download.svelte";

    export let headingProfilData = {};
    const { AVATAR, PROFESSION, FIRSTNAME, LASTNAME } = headingProfilData;
    export let socialData;
    export let skillsData;
    export let toolsData;
    export let trustData;
    export let cvData;
    
</script>
<section class="profil">
    <Avatar avatar={AVATAR}/>
    <Profil 
    profession={PROFESSION}
    firstname={FIRSTNAME}
    lastname={LASTNAME}
    />
    <Social {socialData}/>
</section>
<Skills {skillsData}/>
<Tools {toolsData}/>
<Trust {trustData}/>
<Download {cvData}/>