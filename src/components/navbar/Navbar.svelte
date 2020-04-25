<script>
  export let navlists = [];
  let active = false;
  function onClickMenu() {
    active = !active;
  }
</script>
<nav class="navbar {active ? 'navbar-active': ''}">
  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
    aria-label="Toggle navigation"
    on:click="{onClickMenu}"
  >
    <span class="navbar-toggler-bar"></span>
  </button>
  <div class="navbar-content" id="navbarNav">
    <ul class="nav">
      {#each navlists as list}
      <li class="nav-item">
        <a class="nav-link light-color" href="{list.url}">{list.label}</a>
      </li>
      {/each}
    </ul>
  </div>
</nav>

<style type="text/scss">
  /* .navbar {
    position: fixed;
    right: 5px;
    bottom: 20px;
    button {
      z-index: 100;
      width: 41px;
      height: 41px;
      background-color: #fff;
      border-radius: 50% 50% 50% 50%;
      -webkit-transition: 0.5s ease-in-out;
      transition: 0.5s ease-in-out;
      box-shadow: 0 0 0 0 #fff, 0 0 0 0 #fff;
      border: none;
      &:hover {
        box-shadow: 0 14px 26px -12px rgba(153, 153, 153, 0.42),
          0 4px 23px 0px rgba(0, 0, 0, 0.12),
          0 8px 10px -5px rgba(153, 153, 153, 0.2);
      }
    }
    & &-toggler-bar {
      position: absolute;
      top: calc((41px - 2px) / 2);
      left: calc((41px - 22px) / 2);
      width: 22px;
      height: 2px;
      background: #999999;
      display: block;
      -webkit-transform-origin: center;
      transform-origin: center;
      -webkit-transition: 0.5s ease-in-out;
      transition: 0.5s ease-in-out;
      &:after,
      &:before {
        -webkit-transition: 0.5s ease-in-out;
        transition: 0.5s ease-in-out;
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        background: #999999;
      }
      &:before {
        top: -6px;
      }
      &:after {
        bottom: -6px;
      }
    }
    &-content {
      z-index: 200;
      position: absolute;
      top: 30%;
      right: 10%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      opacity: 0;
      -webkit-transition: 0.25s 0s ease-in-out;
      transition: 0.25s 0s ease-in-out;
    }
    a {
      margin-bottom: 1em;
      display: block;
      color: #000;
      text-decoration: none;
    }
    &-active {
      button {
        &,
        &:hover {
          box-shadow: 0 0 0 25vw #fff, 0 0 0 50vh #fff;
          border-radius: 25%;
        }
      }
      .navbar-toggler-bar {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        &:after {
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
          bottom: 0;
        }
        &:before {
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
          top: 0;
        }
      }
      .navbar-content {
        opacity: 1;
      }
    }
  } */
</style>
