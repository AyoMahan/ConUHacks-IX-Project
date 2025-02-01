<script>
    import Timer from "./Timer.svelte";
</script>
  
  <Timer />
  <div class="container">
    <h1 style= "font-family:papyrus">Pick Your Weapons</h1>
    <div class="top-boxes">
      <div class="box">Item 1</div>
      <div class="box">Item 2</div>
      <div class="box">Item 3 3</div>
    </div>
    <div class="Done">Merge</div>
  </div>
  
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 20px;
    }
  
    .top-boxes {
      display: flex;
      gap: 20px;
    }
  
    .box {
      width: 150px;
      height: 100px;
      background-color: #3498db;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      border-radius: 10px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    }
  
    .bottom-box {
      width: 150px;
      height: 100px;
      background-color: #e74c3c;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      border-radius: 10px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    }
  
    /* Responsive for smaller screens */
    @media (max-width: 500px) {
      .top-boxes {
        flex-direction: column;
        align-items: center;
      }
    }
  </style>
  