// --- 1. FUNGSI AUTH & NAVIGASI ---
function handleLogin() {
    const user = document.getElementById('userLogin').value;
    const pass = document.getElementById('passLogin').value;

    // Validasi sederhana sesuai permintaan Anda
    if(user === "adit" && pass === "123") { 
        // Simpan session agar tidak logout saat refresh
        sessionStorage.setItem("isLoggedIn", "true");
        
        // Pindah ke halaman dashboard
        // Pastikan file dashboard.html ada di folder yang sama
        window.location.href = 'dashboard.html'; 
    } else { 
        alert("Username atau Password Salah!"); 
    }
}

function handleLogout() { 
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = 'index.html';
}

// --- 2. LOGIKA JOBDESK ---
const dateOptions = { day: "numeric", month: "long", year: "numeric" };
const dateNow = new Date().toLocaleDateString("id-ID", dateOptions);

// Inisialisasi Otomatis saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const dateText = document.getElementById("tableDateText");
    if (dateText) {
        dateText.innerText = dateNow;
        renderHistory();
    }
});

function generateJobdesk() {
    const shift = document.getElementById("shiftSelect").value;
    const staffInput = document.getElementById("staffInput").value;
    const jobInput = document.getElementById("jobInput").value;

    const staffArr = staffInput.split("\n").filter(t => t.trim() !== "");
    const jobArr = jobInput.split("\n").filter(t => t.trim() !== "");

    if (staffArr.length < 1) return alert("Isi nama staff minimal 1 orang!");

    // Logika Pengacakan: Baris pertama staff selalu OPERATOR
    const operator = staffArr[0];
    const others = staffArr.slice(1);
    let shuffledJobs = [...jobArr].sort(() => Math.random() - 0.5);

    const results = [{ name: operator, job: "OPERATOR" }];
    others.forEach((name, i) => {
        results.push({ name, job: shuffledJobs[i] || "OFF / CADANGAN" });
    });

    document.getElementById("shiftDisplayText").innerText = shift;
    renderTable(results);
    saveData(results, shift);
}

function renderTable(data) {
    const tbody = document.getElementById("resultBody");
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr class="${item.job === 'OPERATOR' ? 'operator-lock' : ''}">
            <td>${item.name.toUpperCase()}</td>
            <td>${item.job.toUpperCase()}</td>
        </tr>
    `).join('');
}

// --- 3. PENYIMPANAN DATA (LOCAL STORAGE) ---
function saveData(data, shift) {
    let history = JSON.parse(localStorage.getItem("tvtoto_history")) || [];
    const entry = { id: Date.now(), date: dateNow, shift, assignments: data };
    
    history.unshift(entry); // Tambah ke urutan paling atas
    localStorage.setItem("tvtoto_history", JSON.stringify(history.slice(0, 5))); // Simpan 5 terakhir
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;

    let history = JSON.parse(localStorage.getItem("tvtoto_history")) || [];
    list.innerHTML = history.map(item => `
        <div class="history-item" onclick="loadHistory(${item.id})">
            <strong>${item.shift}</strong><br>
            <span style="font-size: 9px; opacity: 0.7;">${item.date}</span>
        </div>
    `).join('') || "Belum ada riwayat.";
}

window.loadHistory = function(id) {
    let history = JSON.parse(localStorage.getItem("tvtoto_history")) || [];
    const item = history.find(h => h.id === id);
    if (item) {
        document.getElementById("shiftDisplayText").innerText = item.shift;
        renderTable(item.assignments);
    }
}

// --- 4. EKSPOR GAMBAR (HTML2CANVAS) ---
function downloadImage() {
    const captureArea = document.getElementById("captureArea");
    if (!captureArea) return;

    html2canvas(captureArea, {
        backgroundColor: "#ffffff", // Pastikan background putih saat diunduh
        scale: 2 // Resolusi lebih tinggi
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = `Jobdesk-TVTOTO-${dateNow}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
