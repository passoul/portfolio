<script>
    export let cvData = {};
    const { TITLE, URL } = cvData;
</script>

<section class="download-cv">
    {TITLE}
    <button class="cv-btn">
        <a href={URL}>{TITLE}</a>
    </button>
</section>