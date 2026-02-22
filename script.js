// Auth
function toggleAuth(type) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById(type + 'Form').classList.remove('hidden');
}

function handleLogin() {
    const user = document.getElementById('userLogin').value;
    if(user !== "") { location.href = 'jobdesk.html'; } 
    else { alert("Isi Username!"); }
}

function handleLogout() { location.href = 'index.html'; }

// Jobdesk Logic
const dateOptions = { day: "numeric", month: "long", year: "numeric" };
const dateNow = new Date().toLocaleDateString("id-ID", dateOptions);

if (document.getElementById("tableDateText")) {
    document.getElementById("tableDateText").innerText = dateNow;
    renderHistory();
}

function generateJobdesk() {
    const shift = document.getElementById("shiftSelect").value;
    document.getElementById("shiftDisplayText").innerText = shift;

    const staffArr = document.getElementById("staffInput").value.split("\n").filter(t => t.trim() !== "");
    const jobArr = document.getElementById("jobInput").value.split("\n").filter(t => t.trim() !== "");

    if (staffArr.length < 1) return alert("Isi nama staff!");

    const operator = staffArr[0];
    const others = staffArr.slice(1);
    let shuffledJobs = [...jobArr].sort(() => Math.random() - 0.5);

    const results = [{ name: operator, job: "OPERATOR" }];
    others.forEach((name, i) => {
        results.push({ name, job: shuffledJobs[i] || "OFF / CADANGAN" });
    });

    renderTable(results);
    saveData(results, shift);
}

function renderTable(data) {
    const tbody = document.getElementById("resultBody");
    tbody.innerHTML = data.map(item => `
        <tr class="${item.job === 'OPERATOR' ? 'operator-lock' : ''}">
            <td>${item.name.toUpperCase()}</td>
            <td>${item.job.toUpperCase()}</td>
        </tr>
    `).join('');
}

function saveData(data, shift) {
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
            ${item.shift}<br>${item.date}
        </div>
    `).join('') || "Kosong";
}

window.loadHistory = function(id) {
    let history = JSON.parse(localStorage.getItem("tvtoto_history")) || [];
    const item = history.find(h => h.id === id);
    if (item) {
        document.getElementById("shiftDisplayText").innerText = item.shift;
        renderTable(item.assignments);
    }
}

function clearHistory() {
    localStorage.removeItem("tvtoto_history");
    renderHistory();
}

function downloadImage() {
    html2canvas(document.getElementById("captureArea")).then(canvas => {
        const link = document.createElement("a");
        link.download = `Jobdesk-${dateNow}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}
