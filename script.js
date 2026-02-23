// --- CONFIG & DATA ---
const dateOptions = { day: "numeric", month: "long", year: "numeric" };
const dateNow = new Date().toLocaleDateString("id-ID", dateOptions);

// Inisialisasi Data
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("tableDateText")) {
        document.getElementById("tableDateText").innerText = dateNow;
        if(document.getElementById("pDate")) document.getElementById("pDate").innerText = dateNow.toUpperCase();
        renderHistory();
        loadSavedInputs();
    }
});

// --- NAVIGATION ---
function switchTab(tabId) {
    // Sembunyikan semua tab
    document.getElementById('tabJobdesk').classList.add('hidden');
    document.getElementById('tabAbsensi').classList.add('hidden');
    
    // Tampilkan tab yang dipilih
    document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1)).classList.remove('hidden');
    
    // Update State Menu
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// --- JOBDESK LOGIC ---
function generateJobdesk() {
    const shift = document.getElementById("shiftSelect").value;
    const staffInput = document.getElementById("staffInput").value;
    const jobInput = document.getElementById("jobInput").value;

    const staffArr = staffInput.split("\n").filter(t => t.trim() !== "");
    const jobArr = jobInput.split("\n").filter(t => t.trim() !== "");

    if (staffArr.length < 1) return alert("Minimal isi 1 nama staff!");

    // Simpan input terakhir ke localStorage
    localStorage.setItem('last_staff', staffInput);
    localStorage.setItem('last_jobs', jobInput);

    const operator = staffArr[0];
    const others = staffArr.slice(1);
    let shuffledJobs = [...jobArr].sort(() => Math.random() - 0.5);

    const results = [{ name: operator, job: "OPERATOR" }];
    others.forEach((name, i) => {
        results.push({ name, job: shuffledJobs[i] || "OFF / CADANGAN" });
    });

    document.getElementById("shiftDisplayText").innerText = shift;
    renderJobTable(results);
    saveJobHistory(results, shift);
}

function renderJobTable(data) {
    const tbody = document.getElementById("resultBody");
    tbody.innerHTML = data.map(item => `
        <tr class="${item.job === 'OPERATOR' ? 'operator-lock' : ''}">
            <td>${item.name.toUpperCase()}</td>
            <td>${item.job.toUpperCase()}</td>
        </tr>
    `).join('');
}

function saveJobHistory(data, shift) {
    let history = JSON.parse(localStorage.getItem("tvtoto_history")) || [];
    const entry = { id: Date.now(), date: dateNow, shift, assignments: data };
    history.unshift(entry);
    localStorage.setItem("tvtoto_history", JSON.stringify(history.slice(0, 5)));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;
    let history = JSON.parse(localStorage.getItem("tvtoto_history")) || [];
    list.innerHTML = history.map(item => `
        <div class="history-item" onclick="loadHistory(${item.id})">
            <strong>${item.shift}</strong><br><small>${item.date}</small>
        </div>
    `).join('') || "<p style='font-size:11px; opacity:0.5'>Belum ada riwayat</p>";
}

function loadSavedInputs() {
    if(localStorage.getItem('last_staff')) 
        document.getElementById('staffInput').value = localStorage.getItem('last_staff');
    if(localStorage.getItem('last_jobs')) 
        document.getElementById('jobInput').value = localStorage.getItem('last_jobs');
}

// --- ABSENSI LOGIC ---
let absenData = [];
const shiftConfig = {
    "PAGI": "07:45",
    "SORE": "15:45",
    "MALAM": "21:45"
};

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
    document.querySelectorAll('#clockDisplay').forEach(el => el.innerText = timeStr);
}
setInterval(updateClock, 1000);

function tambahAbsen() {
    const name = document.getElementById("iNameAbsen").value.trim();
    const shift = document.getElementById("sShiftAbsen").value;
    
    if (!name) return alert("Nama tidak boleh kosong!");

    const now = new Date();
    const timeNow = now.getHours() * 60 + now.getMinutes();
    
    const targetParts = shiftConfig[shift].split(":");
    const timeTarget = parseInt(targetParts[0]) * 60 + parseInt(targetParts[1]);

    const status = timeNow <= timeTarget ? "TEPAT WAKTU" : "TERLAMBAT";
    
    const newAbsen = {
        shift,
        name: name.toUpperCase(),
        target: shiftConfig[shift],
        aktual: now.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
        status: status
    };

    absenData.push(newAbsen);
    renderAbsenTable();
    updateStats();
    document.getElementById("iNameAbsen").value = "";
}

function renderAbsenTable() {
    const tbody = document.querySelector("#tblAbsensi tbody");
    tbody.innerHTML = absenData.map(item => `
        <tr>
            <td>${item.shift}</td>
            <td style="text-align:left">${item.name}</td>
            <td>${item.target}</td>
            <td>${item.aktual}</td>
            <td><span class="badge-${item.status === 'TEPAT WAKTU' ? 'green' : 'red'}">${item.status}</span></td>
        </tr>
    `).join('');
}

function updateStats() {
    const onTime = absenData.filter(a => a.status === "TEPAT WAKTU").length;
    const late = absenData.filter(a => a.status === "TERLAMBAT").length;
    
    document.querySelectorAll("#sOn").forEach(el => el.innerText = onTime);
    document.querySelectorAll("#sLate").forEach(el => el.innerText = late);
}

// --- UTILS ---
function downloadImage() {
    const area = document.getElementById("captureArea");
    html2canvas(area, { backgroundColor: "#ffffff", scale: 2 }).then(canvas => {
        const link = document.createElement("a");
        link.download = `Jobdesk-${dateNow}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

function handleLogin() {
    const user = document.getElementById('userLogin').value;
    const pass = document.getElementById('passLogin').value;

    if (user !== "") {
        // 1. Sembunyikan halaman login
        const loginPage = document.getElementById('loginPage');
        if (loginPage) {
            loginPage.style.display = 'none'; 
        }
        
        // 2. Jika kamu menggunakan file terpisah, arahkan ke dashboard
        // Hapus baris di bawah ini jika kamu ingin sistem satu halaman (SPA)
        location.href = 'dashboard.html'; 
    } else {
        alert("Masukkan Username!");
    }
}
