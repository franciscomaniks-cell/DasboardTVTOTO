// 1. SISTEM NAVIGASI TAB
function switchTab(tabName) {
    // Sembunyikan semua tab
    document.getElementById('tabJobdesk').classList.add('hidden');
    document.getElementById('tabAbsensi').classList.add('hidden');
    
    // Hilangkan status aktif di menu
    document.getElementById('btnNavJobdesk').classList.remove('active');
    document.getElementById('btnNavAbsensi').classList.remove('active');
    
    // Tampilkan tab yang dipilih
    if(tabName === 'jobdesk') {
        document.getElementById('tabJobdesk').classList.remove('hidden');
        document.getElementById('btnNavJobdesk').classList.add('active');
    } else {
        document.getElementById('tabAbsensi').classList.remove('hidden');
        document.getElementById('btnNavAbsensi').classList.add('active');
    }
}

// 2. SISTEM PENGACAK JOBDESK
function generateJobdesk() {
    const shift = document.getElementById("shiftSelect").value;
    const staff = document.getElementById("staffInput").value.split("\n").filter(t => t.trim() !== "");
    const jobs = document.getElementById("jobInput").value.split("\n").filter(t => t.trim() !== "");
    
    if(staff.length === 0) return alert("Masukkan nama staff!");

    document.getElementById("shiftDisplayText").innerText = shift;
    const tbody = document.getElementById("resultBody");
    
    // Acak Jobdesk (Kecuali Operator Baris 1)
    let operator = staff[0];
    let members = staff.slice(1);
    let shuffledJobs = [...jobs].sort(() => Math.random() - 0.5);
    
    let html = `<tr><td>${operator.toUpperCase()}</td><td>OPERATOR</td></tr>`;
    members.forEach((name, i) => {
        html += `<tr><td>${name.toUpperCase()}</td><td>${shuffledJobs[i] || 'OFF'}</td></tr>`;
    });
    
    tbody.innerHTML = html;
}

// 3. SISTEM ABSENSI (VOICE)
function speakAI(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'id-ID';
    utter.rate = 0.9;
    synth.speak(utter);
}

function tambahAbsen() {
    const nameInput = document.getElementById("iNameAbsen");
    const name = nameInput.value.trim().toUpperCase();
    const shift = document.getElementById("sShiftAbsen").value;
    const time = document.getElementById("clockDisplay").innerText;
    
    if(!name) return alert("Ketik nama staff!");
    
    // Suara AI
    speakAI("Selamat datang " + name.toLowerCase());
    
    const tbody = document.querySelector("#tblAbsensi tbody");
    const row = tbody.insertRow(0);
    row.style.background = "#fff";
    row.style.color = "#000";
    
    row.innerHTML = `
        <td>${shift}</td>
        <td style="text-align:left; padding-left:15px;">${name}</td>
        <td>TARGET</td>
        <td>${time}</td>
        <td style="color:green">TEPAT</td>
    `;
    
    nameInput.value = "";
    updateStats();
}

function updateStats() {
    const total = document.querySelectorAll("#tblAbsensi tbody tr").length;
    document.getElementById("sOn").innerText = total;
}

// 4. JAM DIGITAL & TANGGAL
function updateClock() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const clockElement = document.getElementById("clockDisplay");
    if(clockElement) clockElement.innerText = timeStr;
    
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const dateElement = document.getElementById("tableDateText");
    if(dateElement) dateElement.innerText = dateStr;
    
    const pDate = document.getElementById("pDate");
    if(pDate) pDate.innerText = dateStr.toUpperCase();
}

setInterval(updateClock, 1000);
window.onload = updateClock;

// 5. DOWNLOAD PNG
function downloadImage() {
    const area = document.getElementById("captureArea");
    html2canvas(area).then(canvas => {
        const link = document.createElement("a");
        link.download = "Jobdesk-TVTOTO.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}
