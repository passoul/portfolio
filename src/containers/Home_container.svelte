<script>
    import { fly } from 'svelte/transition';
    import { onMount } from "svelte";
    import ENV_CONST from "../constants/constants";
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
    const { NODATA } = ENV_CONST;
    
    export let socialData;
    export let skillsData;
    export let toolsData;
    export let trustData;
    export let cvData;
    
    const sectionListObj = [skillsData, toolsData, trustData, cvData];

    let y;
    let bxx = 0;
    let show = false;
    let sections;
    let sectionsArray = [];
    let sectionsIsDefined = false;
    let viewPortHeight = window.innerHeight;

    onMount( async () => {
  
        await fetch('<@HOME@>').then(() => {

            sections = document.querySelectorAll('section[class*="-section"]');

            setTimeout(() => {
                sections.forEach(function(section, index){
                    sectionsArray.push({
                        el: section,
                        elTop: section.offsetTop,
                        isVisible: false                
                    });         
                })
            }, 1000);

        })

    });
     

    $: (() => {
        let scrollpos = window.scrollY;
        let header = document.getElementById("header");
        
        if(y > 10){
            header.classList.add("shadow");
        }
        if(y < 10){
            header.classList.remove("shadow");
        }
        // Handle each section
        if (sectionsArray.length > 0) {
            sectionsArray.forEach(function(el, index){

                if(el.elTop + ( viewPortHeight / 3 ) < viewPortHeight + y && !el.isVisible){
                    animeSection(el);            
                }    
            });
        }
    })();

// Show profil block
  setTimeout(() => { show = true }, 1000)
  $: bx = -1 * bxx;

//   Anime section function
const animeSection = (element) => {
    element.isVisible = !element.isVisible;
    element.el.classList.add("slide-top");
}
    
</script>

    <svelte:window bind:scrollY={y}/>
    
    <section class="profil mx-auto flex flex-wrap flex-col lg:flex-row items-center bg-black">
        <div class="container mx-auto flex flex-wrap flex-col lg:flex-row content-center">
            {#if show}
            <div class="profil-box dark:bg-gray-900 bg-white-500 rounded shadow px-4 py-8 lg:px-4 lg:py-4 mt-8 lg:mt-3 mx-3 flex flex-wrap flex-col lg:flex-row items-center delay-200 w-5/6 lg:w-auto" in:fly="{{delay: 100, duration: 1300, y: 100, opacity: 0.5}}">
                <Avatar avatar={AVATAR} avatarClass="lg:hidden" />
                <div class="flex flex-col w-full justify-center items-start text-center lg:text-left pb-4">
                    <Profil
                    profession={PROFESSION}
                    firstname={FIRSTNAME}
                    lastname={LASTNAME}
                    />
                    <Social {socialData} socialClass="mx-auto lg:mx-0"/>
                </div>
            </div>
        {/if}
        </div>
    </section>

    <SeperateBar seperateBarClass="wave-top dark:bg-gray-900 bg-white"/>

    {#each sectionListObj as element, i}

        <section id="{element.NAME}" class="{element.NAME == 'skills' || element.NAME == 'tools' ? 'border-b dark:bg-gray-900 bg-white ' : '' }{element.NAME == 'skills' || element.NAME == 'tools' || element.NAME == 'trust' ? 'py-8 ' : ''}{element.NAME == 'cv' ? 'text-center py-6 pb-6' : element.NAME == 'skills' || element.NAME == 'tools' ? element.NAME == 'skills' ? 'dark:border-gray-800' : 'dark:border-gray-600' : 'bg-gray-100 dark:bg-gray-800'} {element.NAME}-section">
            <div class="container mx-auto pt-4 pb-6">
                {#if element.NAME == 'skills'}
                    <Skills skillsData={element}/> 
                {:else if element.NAME == 'tools'}
                    <Tools toolsData={element}/> 
                {:else if element.NAME == 'trust'}
                    <Trust trustData={element}/> 
                {:else if element.NAME == 'cv'}
                    <Download cvData={element}/> 
                {:else}
                    <p>{NODATA}</p>
                {/if}
            </div>
        </section>
        {#if i == 2}
            <SeperateBar seperateBarClass="wave-bottom"/>
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
        min-height: calc(100vh);
    }
    :global(section:first-of-type) {
        min-height: calc(100vh - 127px);
    }
    :global(section:nth-of-type(4)) {
        min-height: calc(100vh - 127px);
    }
    :global(section:last-of-type){
        min-height: calc(100vh - 92px);
    }
    .profil-box{
        @apply bg-opacity-75;
    }
    :global(.skills-section, .tools-section, .trust-section, .cv-section){
		opacity: 0;
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