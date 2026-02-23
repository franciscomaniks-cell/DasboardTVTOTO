// Validasi Login
function handleLogin() {
    const u = document.getElementById('userLogin').value;
    const p = document.getElementById('passLogin').value;
    if(u === "adit" && p === "123") {
        window.location.href = 'dashboard.html';
    } else {
        alert("Akses Ditolak!");
    }
}

// Navigasi Tab
function switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const target = 'tab' + name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById(target).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

// Auto-Save Staff saat mengetik
document.addEventListener('DOMContentLoaded', () => {
    const staffArea = document.getElementById('staffInput');
    const jobArea = document.getElementById('jobInput');
    
    if(staffArea) {
        staffArea.value = localStorage.getItem('savedStaff') || "";
        jobArea.value = localStorage.getItem('savedJobs') || "";
        
        staffArea.addEventListener('input', () => localStorage.setItem('savedStaff', staffArea.value));
        jobArea.addEventListener('input', () => localStorage.setItem('savedJobs', jobArea.value));
        
        document.getElementById('tableDateText').innerText = new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
    }
});

// Logika Pengacakan
function generateJobdesk() {
    const shift = document.getElementById('shiftSelect').value;
    const staff = document.getElementById('staffInput').value.split('\n').filter(x => x.trim() !== "");
    const jobs = document.getElementById('jobInput').value.split('\n').filter(x => x.trim() !== "");

    if(staff.length === 0) return alert("Isi nama staff!");

    let results = [];
    // Baris 1 selalu OPERATOR
    results.push({ name: staff[0], job: "OPERATOR" });

    let remainingStaff = staff.slice(1);
    let shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);

    remainingStaff.forEach((s, i) => {
        results.push({ name: s, job: shuffledJobs[i] || "CADANGAN" });
    });

    document.getElementById('shiftDisplayText').innerText = shift;
    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = results.map(r => `
        <tr class="${r.job === 'OPERATOR' ? 'op-row' : ''}">
            <td>${r.name.toUpperCase()}</td>
            <td>${r.job.toUpperCase()}</td>
        </tr>
    `).join('');
}

function downloadImage() {
    html2canvas(document.getElementById('captureArea')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'jobdesk.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function handleLogout() {
    if(confirm("Logout?")) window.location.href = 'index.html';
}
