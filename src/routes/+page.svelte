<script>
  import { goto } from '$app/navigation';

  const goToSignup = () => goto('/signup');
  const goToLogin = () => goto('/login');
</script>

<!-- Fullscreen Hero Section -->
<div class="relative min-h-screen flex flex-col items-center justify-center text-center text-black bg-cover bg-center"
  style="background-image: url('https://images.pexels.com/photos/7500316/pexels-photo-7500316.jpeg');">

  <!-- Overlay for darkening background -->
  <div class="absolute inset-0 bg-black/50"></div>

  <!-- Content -->
  <div class="relative z-10 px-4">
    <h1 class="text-6xl font-extrabold mb-6 drop-shadow-lg">Wellness Tracker</h1>
    
    <!-- White text for tagline -->
    <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-black-300 drop-shadow-md">
       <span class="font-semibold">Track your steps, sleep, mood, and notes every day<br/>
      Stay healthy, balanced, and mindful of your lifestyle 🌱</span>
    </p>

    <!-- Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        on:click={goToSignup} 
        class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
        <span>📝</span> Signup
      </button>
      <button 
        on:click={goToLogin} 
        class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
        <span>🔑</span> Login
      </button>
    </div>
  </div>

  <!-- About section at bottom -->
  <div class="absolute bottom-6 text-green-200 text-sm px-6 max-w-xl mx-auto">
    <p>
      💡 Wellness Tracker helps you build better habits and visualize your daily progress.  
      Stay motivated and keep your lifestyle on track every day!
    </p>
  </div>
</div>
