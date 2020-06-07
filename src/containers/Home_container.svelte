<script>
    import { fly } from 'svelte/transition';
    import { getContext } from "svelte";
    import { SLIDETOP, PROFILANIMY, PROFILANIMDURATION, PROFILANIMDELAY, PROFILANIMOPACITY } from "../store/constant";
    import { NOCOMPONENT, SKILLS_DATA, TOOLS_DATA,
        TRUST_DATA, CV_DATA } from "../store/data";
    import { SHOWPROFIL, SKILLSANIMEND } from "../store/states";
	import Avatar from "../components/avatar/Avatar.svelte";
	import Profil from "../components/heading/Profil.svelte";
	import Social from "../components/buttons/social/Social.svelte";
	import Skills from "../components/skills/Skills.svelte";
	import Tools from "../components/tools/Tools.svelte";
	import Trust from "../components/trust/Trust.svelte";
	import Download from "../components/buttons/download/Download.svelte";
	import SeperateBar from "../components/seperatebar/SeperateBar.svelte";
    
    const sectionListObj = [
        {
            'component': Skills,
            'data': $SKILLS_DATA
        }, 
        {
            'component': Tools,
            'data': $TOOLS_DATA
        }, 
        {
            'component': Trust,
            'data': $TRUST_DATA
        }, 
        {
            'component': Download,
            'data': $CV_DATA
        }, 
    ];

    let y;
    let viewPortHeight = window.innerHeight;

    let sectionsArray = getContext('sections'); 
     

    $: (() => {
        // Handle each section
        if (sectionsArray.length > 0) {
            sectionsArray.forEach(function(el, index){

                if(el.elTop + ( viewPortHeight / 3 ) < viewPortHeight + y && !el.isVisible){
                    animeSection(el);            
                }    
            });
        }
    })();

// Anime section function
    const animeSection = (element) => {
        if(!element.isVisible){
            element.isVisible = !element.isVisible;
            element.el.classList.add(SLIDETOP);
        }
    }

// Show profil block
  setTimeout(() => { SHOWPROFIL.set(true) }, 1000)
</script>

    <svelte:window bind:scrollY={y}/> 
    <section class="profil mx-auto flex flex-wrap flex-col lg:flex-row items-center bg-black">
        <div class="container mx-auto flex flex-wrap flex-col lg:flex-row content-center">
            {#if $SHOWPROFIL}
            <div class="profil-box dark:bg-gray-900 bg-white-500 rounded shadow px-4 py-8 lg:px-4 lg:py-4 mt-8 lg:mt-3 mx-3 flex flex-wrap flex-col lg:flex-row items-center delay-200 w-5/6 lg:w-auto" transition:fly="{{delay: PROFILANIMDELAY, duration: PROFILANIMDURATION, y: PROFILANIMY, opacity: PROFILANIMOPACITY}}">
                <Avatar avatarClass="lg:hidden" position="profil" />
                <div class="flex flex-col w-full justify-center items-start text-center lg:text-left pb-4">
                    <Profil />
                    <Social socialClass="mx-auto lg:mx-0"/>
                </div>
            </div>
        {/if}
        </div>
    </section>
    <SeperateBar seperateBarClass="dark:bg-gray-900 bg-white" position="top"/>
    {#each sectionListObj as {component, data}, i}
        <section id="{data.NAME}" class="{data.NAME == 'skills' || data.NAME == 'tools' ? 'border-b dark:bg-gray-900 bg-white ' : '' }{data.NAME == 'skills' || data.NAME == 'tools' || data.NAME == 'trust' ? 'py-8 ' : ''}{data.NAME == 'cv' ? 'text-center py-6 pb-6' : data.NAME == 'skills' || data.NAME == 'tools' ? data.NAME == 'skills' ? 'dark:border-gray-800' : 'dark:border-gray-500' : 'bg-white-transDark'} opacity-0 {data.NAME}-section">
            <div class="container mx-auto pt-4 pb-6">
                {#if component != undefined}
                    <svelte:component this="{component}"/>
                {:else}
                    <p>{NOCOMPONENT}</p>
                {/if}
            </div>
        </section>
        {#if i == 2}
            <SeperateBar position="bottom"/>
        {/if}
    {/each}
<style>
    .profil {
        background-image: url("<@IMGDIR@>/background/top-bg.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
    :global(section) {
        min-height: calc(100vh / 2);
    }
    :global(section:first-of-type) {
        min-height: calc(100vh - 127px);
    }
    :global(section:nth-of-type(4)) {
        min-height: calc(calc(100vh - 127px) / 2);
    }
    :global(section:last-of-type){
        min-height: calc(calc(100vh - 92px) / 2 );
    }
    .profil-box{
        @apply bg-opacity-75;
    }
    :global(.slide-top) {
        -webkit-animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                opacity: 1;
    }
    @-webkit-keyframes slide-top {
        0% {
            -webkit-transform: translateY(100px);
                    transform: translateY(100px);
        }
        100% {
            -webkit-transform: translateY(0);
                    transform: translateY(0);
        }
    }
    @keyframes slide-top {
        0% {
            -webkit-transform: translateY(100px);
                    transform: translateY(100px);
        }
        100% {
            -webkit-transform: translateY(0);
                    transform: translateY(0);
        }
    }
    @screen lg {
        :global(section) {
            min-height: calc(100vh - 64px);
        }
        :global(section:nth-of-type(4)) {
            min-height: calc(100vh - 191px);
        }
        :global(section:last-of-type){
            min-height: calc(100vh - 156px);
        }
    }
</style>