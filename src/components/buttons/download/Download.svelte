<script>
    export let cvData = {};
    const { TITLE, URL } = cvData;
</script>

<div className="download-cv">
    {TITLE}
    <button className="cv-btn">
        <a href={URL}>{TITLE}</a>
    </button>
</div>