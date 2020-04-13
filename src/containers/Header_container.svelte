<script>
	import Avatar from "../components/avatar/Avatar.svelte";
	import Profil from "../components/heading/Profil.svelte";
	import Social from "../components/buttons/social/Social.svelte";
	import Switch from "../components/buttons/switch/Switch.svelte";

    export let headingProfilData = {};
    const { AVATAR, PROFESSION, FIRSTNAME, LASTNAME } = headingProfilData;
    export let socialData;

</script>

<header>
	<Avatar avatar={AVATAR}/>
	<Profil 
	profession={PROFESSION}
	firstname={FIRSTNAME}
	lastname={LASTNAME}
	/>
	<Social {socialData}/>
	<Switch/>
</header>