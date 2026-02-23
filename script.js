// 1. VALIDASI LOGIN
function handleLogin() {
    const u = document.getElementById('userLogin').value;
    const p = document.getElementById('passLogin').value;
    // Login menggunakan kredensial adit / 123
    if (u === "adit" && p === "123") {
        window.location.href = 'dashboard.html';
    } else {
        alert("Akses Ditolak! Periksa Username & Password.");
    }
}

// 2. NAVIGASI TAB SIDEBAR (Memperbaiki menu yang tidak bisa diklik)
function switchTab(name) {
    // Sembunyikan semua konten tab
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    
    // Hapus status active dari semua menu sidebar
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Tampilkan tab yang dipilih (ID harus sesuai, misal: tab-jobdesk)
    const targetId = 'tab-' + name;
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        targetElement.classList.remove('hidden');
    }
    
    // Tandai menu sidebar yang diklik sebagai active
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// 3. AUTO-SAVE STAFF & INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
    const staffArea = document.getElementById('staffInput');
    const jobArea = document.getElementById('jobInput');
    const dateText = document.getElementById('dateText');

    if (staffArea && jobArea) {
        // Ambil data yang tersimpan di browser
        staffArea.value = localStorage.getItem('savedStaff') || "";
        jobArea.value = localStorage.getItem('savedJobs') || "";

        // Simpan otomatis setiap ada perubahan ketikan
        staffArea.addEventListener('input', () => localStorage.setItem('savedStaff', staffArea.value));
        jobArea.addEventListener('input', () => localStorage.setItem('savedJobs', jobArea.value));
    }

    // Set tanggal otomatis pada laporan
    if (dateText) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateText.innerText = new Date().toLocaleDateString('id-ID', options);
    }
});

// 4. LOGIKA PENGACAKAN JOBDESK
function generateJobdesk() {
    const shift = document.getElementById('shiftSelect').value;
    const staff = document.getElementById('staffInput').value.split('\n').filter(x => x.trim() !== "");
    const jobs = document.getElementById('jobInput').value.split('\n').filter(x => x.trim() !== "");

    if (staff.length === 0) return alert("Isi nama staff terlebih dahulu!");

    let results = [];
    // Baris pertama staff selalu mendapatkan tugas OPERATOR
    results.push({ name: staff[0], job: "OPERATOR" });

    // Acak sisa staff dengan sisa job yang ada
    let remainingStaff = staff.slice(1);
    let shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);

    remainingStaff.forEach((name, i) => {
        results.push({ 
            name: name, 
            job: shuffledJobs[i] || "CADANGAN / OFF" 
        });
    });

    // Update tampilan tabel hasil
    document.getElementById('shiftText').innerText = shift;
    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = results.map(r => `
        <tr class="${r.job === 'OPERATOR' ? 'op-row' : ''}">
            <td>${r.name.toUpperCase()}</td>
            <td>${r.job.toUpperCase()}</td>
        </tr>
    `).join('');
}

// 5. DOWNLOAD PNG
function downloadImage() {
    const area = document.getElementById('captureArea');
    html2canvas(area, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Jobdesk-TVTOTO-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 6. LOGOUT
function handleLogout() {
    if (confirm("Apakah Anda yakin ingin Logout?")) {
        window.location.href = 'index.html';
    }
}
