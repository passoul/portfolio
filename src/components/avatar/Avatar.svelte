<script>
    export let avatar = {};
    const { alt, src } = avatar;
    export let rounded = true;
</script>

<div className="Avatar">
    <img class:rounded {alt} {src} />
</div>