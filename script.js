// 1. AUTO-SAVE & INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
    const staffInput = document.getElementById('staffInput');
    const jobInput = document.getElementById('jobInput');
    const dateText = document.getElementById('dateText');

    if (staffInput) {
        // Ambil data lama jika ada
        staffInput.value = localStorage.getItem('tvtoto_staff') || "";
        jobInput.value = localStorage.getItem('tvtoto_jobs') || "";

        // Simpan setiap kali mengetik
        staffInput.addEventListener('input', () => localStorage.setItem('tvtoto_staff', staffInput.value));
        jobInput.addEventListener('input', () => localStorage.setItem('tvtoto_jobs', jobInput.value));
        
        // Pasang Tanggal Otomatis
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateText.innerText = new Date().toLocaleDateString('id-ID', options);
    }
});

// 2. NAVIGASI TAB SIDEBAR
function switchTab(tabName) {
    // Sembunyikan semua tab
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Tampilkan tab yang dipilih
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    
    // Aktifkan menu sidebar (pencarian berdasarkan teks atau ID)
    event.currentTarget.classList.add('active');
}

// 3. LOGIKA PENGACAKAN JOBDESK
function generateJobdesk() {
    const shift = document.getElementById('shiftSelect').value;
    const staffRaw = document.getElementById('staffInput').value.split('\n').filter(s => s.trim() !== "");
    const jobsRaw = document.getElementById('jobInput').value.split('\n').filter(j => j.trim() !== "");

    if (staffRaw.length === 0) return alert("Masukkan minimal 1 nama staff!");

    let finalData = [];
    
    // Aturan: Baris pertama selalu OPERATOR
    finalData.push({ name: staffRaw[0], job: "OPERATOR" });

    // Sisa staff dan pengacakan job
    let remainingStaff = staffRaw.slice(1);
    let shuffledJobs = [...jobsRaw].sort(() => Math.random() - 0.5);

    remainingStaff.forEach((name, index) => {
        finalData.push({
            name: name,
            job: shuffledJobs[index] || "CADANGAN / OFF"
        });
    });

    // Update Tampilan
    document.getElementById('shiftText').innerText = shift;
    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = finalData.map(item => `
        <tr class="${item.job === 'OPERATOR' ? 'op-row' : ''}">
            <td>${item.name.toUpperCase()}</td>
            <td>${item.job.toUpperCase()}</td>
        </tr>
    `).join('');
}

// 4. DOWNLOAD PNG
function downloadImage() {
    const area = document.getElementById('captureArea');
    html2canvas(area, { backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Jobdesk-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 5. LOGIN & LOGOUT
function handleLogin() {
    const u = document.getElementById('userLogin').value;
    const p = document.getElementById('passLogin').value;
    if (u === "adit" && p === "123") {
        window.location.href = 'dashboard.html';
    } else {
        alert("User atau Password Salah!");
    }
}

function handleLogout() {
    if (confirm("Logout dari sistem?")) window.location.href = 'index.html';
}
