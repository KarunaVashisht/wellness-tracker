<script>
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  const login = async (e) => {
    e.preventDefault(); // stop page refresh
    error = '';
    try {
      await signInWithEmailAndPassword(auth, email, password);
      goto('/dashboard'); // redirect to dashboard
    } catch (err) {
      error = err.message;
    }
  };
</script>

<!-- Background Image -->
<div
  class="min-h-screen flex items-center justify-center bg-cover bg-center relative"
  style="background-image: url('https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg');"
>
  <!-- Overlay to darken background -->
  <div class="absolute inset-0 bg-black/40"></div>

  <!-- Login Card -->
  <div class="relative bg-white shadow-lg rounded-lg p-8 w-full max-w-md z-10">
    <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">Login</h1>
    <p class="text-center text-gray-600 mb-6">Welcome back! Please login to your account.</p>

    {#if error}
      <p class="text-red-600 text-sm mb-4">{error}</p>
    {/if}

    <form class="space-y-5" onsubmit={login}>
      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        type="submit"
        class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
      >
        Login
      </button>
    </form>

    <!-- Signup Redirect -->
    <p class="text-sm text-gray-600 mt-6 text-left">
      Don’t have an account?
      <a href="/signup" class="text-blue-600 hover:underline">Create one</a>
    </p>
  </div>
</div>
