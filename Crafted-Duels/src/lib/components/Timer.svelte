<script>
    import { onMount } from "svelte";
    let timeLeft = 30;
    let timer;
  
    onMount(() => {
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    });
  
    $: if (timeLeft === 0) {
      clearInterval(timer);
    }
  </script>
  
  <!-- Bomb shape -->
  <div class="bomb-container">
    <div class="fuse"></div> <!-- The fuse at the top -->
    <div class="bomb">
      <span class="countdown">{timeLeft}</span>
    </div>
  </div>
  
  <style>
    .bomb-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    /* The fuse (curved wire) */
    .fuse {
      width: 40px;
      height: 20px;
      border-top: 4px dashed orange;
      border-radius: 50%;
      margin-bottom: -10px;
      position: relative;
      animation: flicker 0.5s infinite alternate;
    }
  
    /* The bomb body */
    .bomb {
      width: 100px;
      height: 100px;
      background-color: black;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
      position: relative;
    }
  
    /* Countdown timer inside the bomb */
    .countdown {
      font-size: 2rem;
      font-weight: bold;
      color: white;
    }
  
    /* Fuse flickering effect */
    @keyframes flicker {
      from {
        opacity: 1;
      }
      to {
        opacity: 0.5;
      }
    }
  </style>
  