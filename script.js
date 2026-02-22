// --- 1. NAVIGASI TAB ---
function switchTab(tab) {
    // Tab Elements
    const tabJobdesk = document.getElementById('tabJobdesk');
    const tabAbsensi = document.getElementById('tabAbsensi');
    
    // Nav Elements
    const btnJobdesk = document.getElementById('btnNavJobdesk');
    const btnAbsensi = document.getElementById('btnNavAbsensi');

    if(tab === 'jobdesk') {
        tabJobdesk.classList.remove('hidden');
        tabAbsensi.classList.add('hidden');
        btnJobdesk.classList.add('active');
        btnAbsensi.classList.remove('active');
    } else {
        tabJobdesk.classList.add('hidden');
        tabAbsensi.classList.remove('hidden');
        btnJobdesk.classList.remove('active');
        btnAbsensi.classList.add('active');
    }
}

// --- 2. SISTEM PENGACAK JOBDESK ---
function generateJobdesk() {
    const shift = document.getElementById("shiftSelect").value;
    const staffText = document.getElementById("staffInput").value;
    const jobText = document.getElementById("jobInput").value;

    const staff = staffText.split("\n").filter(line => line.trim() !== "");
    const jobs = jobText.split("\n").filter(line => line.trim() !== "");

    if (staff.length === 0) return alert("Daftar staff tidak boleh kosong!");

    // Update Tampilan Header Tabel
    document.getElementById("shiftDisplayText").innerText = shift;
    document.getElementById("tableDateText").innerText = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });

    const tbody = document.getElementById("resultBody");
    tbody.innerHTML = "";

    // Logika Pengacakan
    let shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);

    staff.forEach((person, index) => {
        const row = document.createElement("tr");
        const tugas = shuffledJobs[index] || "BACKUP / OFF";
        
        row.innerHTML = `
            <td>${person.toUpperCase()}</td>
            <td>${tugas.toUpperCase()}</td>
        `;
        tbody.appendChild(row);
    });
}

// --- 3. SISTEM ABSENSI (VOICE LOGIC) ---
function speakAI(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'id-ID';
    utter.rate = 1.0;
    synth.speak(utter);
}

function tambahAbsen() {
    const nameInput = document.getElementById("iNameAbsen");
    const name = nameInput.value.trim().toUpperCase();
    const shift = document.getElementById("sShiftAbsen").value;
    const time = document.getElementById("clockDisplay").innerText;

    if (!name) return alert("Silakan isi nama staff!");

    // Voice Welcome
    speakAI("Selamat datang " + name.toLowerCase());

    const tbody = document.querySelector("#tblAbsensi tbody");
    const row = tbody.insertRow(0);
    
    row.innerHTML = `
        <td>${shift}</td>
        <td style="text-align:left; padding-left:15px;">${name}</td>
        <td>TARGET</td>
        <td>${time}</td>
        <td style="color:green; font-weight:bold;">TEPAT</td>
    `;

    nameInput.value = "";
    
    // Update Stats Sederhana
    let currentOnTime = parseInt(document.getElementById("sOn").innerText);
    document.getElementById("sOn").innerText = currentOnTime + 1;
}

// --- 4. JAM DIGITAL ---
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
    const clockEl = document.getElementById("clockDisplay");
    if(clockEl) clockEl.innerText = timeStr;
}

setInterval(updateClock, 1000);
window.onload = updateClock;

// --- 5. EXPORT PNG ---
function downloadImage() {
    const target = document.getElementById("captureArea");
    html2canvas(target).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Jobdesk-TVTOTO.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
