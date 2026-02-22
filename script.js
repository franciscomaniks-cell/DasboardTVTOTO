// Navigasi Antar Tab
function switchTab(tabId) {
    // Sembunyikan semua konten
    document.getElementById('contentJobdesk').classList.add('hidden');
    document.getElementById('contentAbsensi').classList.add('hidden');
    
    // Matikan semua menu aktif
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Aktifkan yang dipilih
    if(tabId === 'jobdesk') {
        document.getElementById('contentJobdesk').classList.remove('hidden');
        document.getElementById('navJobdesk').classList.add('active');
    } else {
        document.getElementById('contentAbsensi').classList.remove('hidden');
        document.getElementById('navAbsensi').classList.add('active');
    }
}

// Logika Pengacak Jobdesk
function generateJobdesk() {
    const staff = document.getElementById("staffInput").value.split("\n").filter(x => x.trim() !== "");
    const jobs = document.getElementById("jobInput").value.split("\n").filter(x => x.trim() !== "");
    const shift = document.getElementById("shiftSelect").value;

    if(staff.length === 0) return alert("Masukkan nama staff!");

    document.getElementById("displayShift").innerText = shift;
    document.getElementById("displayDate").innerText = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });

    const tbody = document.getElementById("resultBody");
    tbody.innerHTML = "";

    // Acak Jobdesk
    let shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);

    staff.forEach((name, i) => {
        const row = `<tr>
            <td>${name.toUpperCase()}</td>
            <td>${shuffledJobs[i] || 'CADANGAN / OFF'}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Logika Suara Absensi
function panggilSuara(nama) {
    const ucapan = new SpeechSynthesisUtterance(`Selamat datang ${nama}`);
    ucapan.lang = 'id-ID';
    window.speechSynthesis.speak(ucapan);
}

function prosesAbsen() {
    const nama = document.getElementById("inputNamaAbsen").value.trim();
    if(!nama) return;

    panggilSuara(nama);

    const table = document.getElementById("tableDataAbsensi");
    const row = table.insertRow(0);
    const jam = new Date().toLocaleTimeString('id-ID');

    row.innerHTML = `
        <td style="padding:10px; border-bottom:1px solid #334155;">${nama.toUpperCase()}</td>
        <td style="padding:10px; border-bottom:1px solid #334155;">${jam}</td>
        <td style="padding:10px; border-bottom:1px solid #334155; color:#00ff88;">HADIR</td>
    `;

    document.getElementById("inputNamaAbsen").value = "";
    // Update counter
    let count = document.getElementById("countHadir");
    count.innerText = parseInt(count.innerText) + 1;
}

// Jam Digital
setInterval(() => {
    const jamEl = document.getElementById("jamRunning");
    if(jamEl) jamEl.innerText = new Date().toLocaleTimeString('id-ID');
}, 1000);
