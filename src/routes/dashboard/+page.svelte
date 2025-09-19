<script>
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { signOut } from 'firebase/auth';
  import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  import jsPDF from 'jspdf';
  import 'jspdf-autotable';

  let userName = auth.currentUser?.email || "User";
  let steps = [];
  let sleep = [];
  let dates = [];
  let entries = [];

  let newSteps = '';
  let newSleep = '';
  let newMood = '';
  let newNotes = '';

  let healthTip = "";

  const logout = async () => {
    await signOut(auth);
    goto('/login');
  };

  // Save new entry
  const addEntry = async () => {
    if (!newSteps || !newSleep || !newMood) return;

    await addDoc(collection(db, 'wellness'), {
      user: userName,
      steps: Number(newSteps),
      sleep: Number(newSleep),
      mood: newMood,
      notes: newNotes,
      date: new Date()
    });

    newSteps = '';
    newSleep = '';
    newMood = '';
    newNotes = '';

    loadEntries();
  };

  // Load past entries
  const loadEntries = async () => {
    const q = query(collection(db, 'wellness'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    steps = entries.map(e => e.steps).reverse();
    sleep = entries.map(e => e.sleep).reverse();
    dates = entries.map(e => new Date(e.date.seconds * 1000).toLocaleDateString()).reverse();

    generateHealthTip();
    renderChart();
  };

  // Rule-based health tip
  function generateHealthTip() {
    if (steps.length === 0) {
      healthTip = "Add an entry to get personalized tips!";
      return;
    }

    let lastSteps = steps[steps.length - 1];
    let lastSleep = sleep[sleep.length - 1];

    if (lastSteps < 5000) {
      healthTip = "Try to walk a bit more today 🚶‍♂️";
    } else if (lastSteps >= 10000) {
      healthTip = "Awesome! You hit your step goal 🎉";
    } else {
      healthTip = "Good work! A little more walking will boost your health 💪";
    }

    if (lastSleep < 6) {
      healthTip += " | Make sure to get enough sleep 😴";
    } else if (lastSleep >= 8) {
      healthTip += " | Great sleep habits 🌙";
    }
  }

  // Export CSV
  function exportCSV() {
    let csv = "Date,Steps,Sleep,Mood,Notes\n";
    entries.forEach(e => {
      csv += `${new Date(e.date.seconds * 1000).toLocaleDateString()},${e.steps},${e.sleep},${e.mood},${e.notes || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wellness_entries.csv";
    link.click();
  }

   // Render chart
  let chartEl;
  let chart;
  async function renderChart() {
    if (!chartEl) return;
    if (chart) chart.destroy();

    const options = {
      chart: { type: 'line', height: 300 },
      series: [
        { name: 'Steps', data: steps },
        { name: 'Sleep (hrs)', data: sleep }
      ],
      xaxis: { categories: dates }
    };

    const ApexCharts = (await import('apexcharts')).default;
    chart = new ApexCharts(chartEl, options);
    chart.render();
  }

  onMount(loadEntries);
</script>

<!-- Top bar -->
<div class="flex justify-between items-center p-4 bg-white-100 shadow-md">
  <h1 class="text-xl font-bold">Welcome, {userName}</h1>
  <button on:click={logout} class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
    Logout
  </button>
</div>

<!-- Health Tip -->
<div class="bg-yellow-100 p-6 rounded shadow text-center mt-4 mx-6">
  <h2 class="text-xl font-semibold text-gray-800 mb-2">💡 Health Tip of the Day</h2>
  <p class="text-lg font-medium text-gray-700">{healthTip}</p>
</div>


<!-- Main content -->
<div class="p-6 space-y-8">
  <p class="text-lg text-gray-700 font-medium text-center">
    Track your daily data and visualize your wellness journey 📊
  </p>

  <!-- Input Form -->
  <div class="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
    <h2 class="text-lg font-semibold mb-4">Add Today’s Entry</h2>
    <div class="space-y-3">
      <input type="number" placeholder="Steps" bind:value={newSteps} class="w-full border p-2 rounded" />
      <input type="number" placeholder="Sleep (hours)" bind:value={newSleep} class="w-full border p-2 rounded" />

      <!-- Mood dropdown -->
      <select bind:value={newMood} class="w-full border p-2 rounded">
        <option value="" disabled selected>Select Mood</option>
        <option>😊 Happy</option>
        <option>😐 Neutral</option>
        <option>😢 Sad</option>
        <option>😴 Tired</option>
        <option>😡 Stressed</option>
        <option>🤩 Excited</option>
      </select>

      <textarea placeholder="Notes" bind:value={newNotes} class="w-full border p-2 rounded"></textarea>
      <button on:click={addEntry} class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Save Entry
      </button>
    </div>
  </div>

  <!-- Two column layout -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left: Summary Table -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">Past Entries</h2>
      {#if entries.length > 0}
        <table class="w-full text-sm text-left border">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2">Date</th>
              <th class="p-2">Steps</th>
              <th class="p-2">Sleep</th>
              <th class="p-2">Mood</th>
            </tr>
          </thead>
          <tbody>
            {#each entries as entry}
              <tr class="border-t">
                <td class="p-2">{new Date(entry.date.seconds * 1000).toLocaleDateString()}</td>
                <td class="p-2">{entry.steps}</td>
                <td class="p-2">{entry.sleep} hrs</td>
                <td class="p-2">{entry.mood}</td>
              </tr>
            {/each}
          </tbody>
        </table>

        <!-- Export buttons -->
        <div class="flex space-x-3 mt-3">
          <button on:click={exportCSV} class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
            Export CSV
          </button>
        </div>
      {:else}
        <p class="text-gray-500">No entries yet.</p>
      {/if}
    </div>

    <!-- Right: Chart -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-2">Progress Chart</h2>
      <div bind:this={chartEl}></div>
    </div>
  </div>
</div>
