<script>	    
    const currentTheme = localStorage.getItem("theme");
    let checked = currentTheme === "dark" ? true : false;
    
    currentTheme === "dark" ? window.document.body.classList.add('dark') : window.document.body.classList.remove('dark');

    function toggleThemeChange () {
        if (checked === true) {
        // Update localstorage
        localStorage.setItem("theme", "dark");
        window.document.body.classList.add('dark');
      } else {
        // Update localstorage
        localStorage.removeItem("theme");
          window.document.body.classList.remove('dark');
      }
    }
    
</script>


<div className="switch-theme-btn">
    <label class="switch">
        <input type="checkbox" bind:checked
        on:change={toggleThemeChange}
        />
        <span class="slider round" />
    </label>
</div>

<style>
/* CSS styling for our switch */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  input:checked+.slider {
    background-color: #2196F3;
  }
  
  input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
  }
  
  input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
</style>