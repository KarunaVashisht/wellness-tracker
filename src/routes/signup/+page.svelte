<script>
  import { auth } from '$lib/firebase';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let error = '';

  const signup = async (e) => {
    e.preventDefault();
    error = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Save display name
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      goto('/dashboard'); // redirect to dashboard
    } catch (err) {
      error = err.message;
    }
  };
</script>

<!-- Background Image -->
<div
  class="min-h-screen flex items-center justify-center bg-cover bg-center relative"
  style="background-image: url('https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg');"
>
  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/40"></div>

  <!-- Signup Card -->
  <div class="relative bg-white shadow-lg rounded-lg p-8 w-full max-w-md z-10">
    <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">Signup</h1>
    <p class="text-center text-gray-600 mb-6">Create a new account to start tracking your wellness 🌱</p>

    {#if error}
      <p class="text-red-600 text-sm mb-4">{error}</p>
    {/if}

    <form class="space-y-5" onsubmit={signup}>
      <input
        type="text"
        placeholder="Full Name"
        bind:value={name}
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

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
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Signup
      </button>
    </form>

    <!-- Login Redirect -->
    <p class="text-sm text-gray-600 mt-6 text-left">
      Already have an account?
      <a href="/login" class="text-green-600 hover:underline">Login</a>
    </p>
  </div>
</div>
