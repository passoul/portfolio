<script>
	import Avatar from "../components/avatar/Avatar.svelte";
	import Profil from "../components/heading/Profil.svelte";
	import Social from "../components/buttons/social/Social.svelte";
	import Skills from "../components/skills/Skills.svelte";
	import Tools from "../components/tools/Tools.svelte";
	import Trust from "../components/trust/Trust.svelte";
	import SeperateBar from "../components/seperatebar/SeperateBar.svelte";
	import Download from "../components/buttons/download/download.svelte";

    export let headingProfilData = {};
    const { AVATAR, PROFESSION, FIRSTNAME, LASTNAME } = headingProfilData;
    export let socialData;
    export let skillsData;
    export let toolsData;
    export let trustData;
    export let cvData;
    
</script>
<section class="profil mx-auto flex flex-wrap flex-col lg:flex-row items-center bg-black">
    <div class="container mx-auto flex flex-wrap flex-col lg:flex-row">
        <div class="profil-box dark:bg-gray-900 bg-white-500 rounded shadow px-4 py-8 lg:px-4 lg:py-4 mt-3 mx-3 flex flex-wrap flex-col lg:flex-row items-center delay-200">
        <Avatar avatar={AVATAR} avatarClass="lg:hidden" widthHeight="128"/>
        <div class="flex flex-col w-full justify-center items-start text-center lg:text-left pb-4">
            <Profil
            profession={PROFESSION}
            firstname={FIRSTNAME}
            lastname={LASTNAME}
            />
            <Social {socialData} socialClass="mx-auto lg:mx-0"/>
        </div>
        </div>
    </div>
</section>

<SeperateBar seperateBarClass="wave-top dark:bg-gray-900 bg-white"/>

<section class="border-b pb-8 dark:bg-gray-900 dark:border-gray-800 bg-white">
    <div class="container mx-auto pt-4 pb-12 ">
        <Skills {skillsData}/>
    </div>
</section>
<section class="border-b py-8 bg-white dark:bg-gray-900 dark:border-gray-600">
    <div class="container mx-auto pt-4 pb-12">
        <Tools {toolsData}/>
    </div>
</section>
<section class="bg-gray-100 dark:bg-gray-800 py-8">
    <div class="container mx-auto flex flex-wrap pt-4 pb-12">
        <Trust {trustData}/>
    </div>
</section>

<SeperateBar seperateBarClass="wave-bottom"/>

<section class="text-center py-6 mb-12">
    <div class="container mx-auto">
        <Download {cvData}/>
    </div>
</section>
<style>
    .profil {
        background-image: url("/static/media/top-bg.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        height: 478px;
    }
    .profil-box{
        @apply bg-opacity-75;
    }
</style>