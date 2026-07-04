// Sabitler
const MONTHS = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];
const DAYS = ["PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA"];

// State
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let weeksInMonth = [];
let currentWeekIndex = 0;
let activitiesData = JSON.parse(localStorage.getItem('weeklyPlannerData')) || {};

// DOM Elements
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const prevWeekBtn = document.getElementById('prevWeekBtn');
const nextWeekBtn = document.getElementById('nextWeekBtn');
const currentWeekDisplay = document.getElementById('currentWeekDisplay');
const planGrid = document.getElementById('planGrid');
const exportContent = document.getElementById('exportContent');

// Init
function init() {
    populateSelectors();
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;
    
    calculateWeeks();
    renderGrid();
    
    monthSelect.addEventListener('change', (e) => { currentMonth = parseInt(e.target.value); calculateWeeks(); renderGrid(); });
    yearSelect.addEventListener('change', (e) => { currentYear = parseInt(e.target.value); calculateWeeks(); renderGrid(); });
    prevWeekBtn.addEventListener('click', () => { if(currentWeekIndex > 0) { currentWeekIndex--; renderGrid(); } });
    nextWeekBtn.addEventListener('click', () => { if(currentWeekIndex < weeksInMonth.length - 1) { currentWeekIndex++; renderGrid(); } });
    
    document.getElementById('clearBtn').addEventListener('click', clearData);
    document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
}

// Selectors
function populateSelectors() {
    MONTHS.forEach((month, index) => {
        let opt = document.createElement('option');
        opt.value = index; opt.textContent = month;
        monthSelect.appendChild(opt);
    });
    const currentY = new Date().getFullYear();
    for (let i = currentY - 2; i <= currentY + 3; i++) {
        let opt = document.createElement('option');
        opt.value = i; opt.textContent = i;
        yearSelect.appendChild(opt);
    }
}

// Hafta Hesaplama
function calculateWeeks() {
    weeksInMonth = [];
    let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    let currentWeek = [];
    
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        let date = new Date(currentYear, currentMonth, i);
        let dayOfWeek = date.getDay(); // 0: Pazar, 1: Pzt ... 6: Cts
        
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            currentWeek.push({
                dateObj: date,
                dayName: DAYS[dayOfWeek - 1],
                dateText: `${i} ${MONTHS[currentMonth]}`,
                dayIndex: dayOfWeek - 1,
                dateKey: `${currentYear}-${currentMonth}-${i}`
            });
        }
        
        if (dayOfWeek === 5 || i === lastDayOfMonth.getDate()) {
            if (currentWeek.length > 0) {
                weeksInMonth.push(currentWeek);
                currentWeek = [];
            }
        }
    }
    
    currentWeekIndex = 0;
}

// Veri Kaydetme
function saveActivity(dateKey, index, text) {
    if (!activitiesData[dateKey]) activitiesData[dateKey] = ["", "", ""];
    activitiesData[dateKey][index] = text;
    localStorage.setItem('weeklyPlannerData', JSON.stringify(activitiesData));
}

// Grid Render (Tasarım Çizimi)
function renderGrid() {
    planGrid.innerHTML = '';
    const weekData = weeksInMonth[currentWeekIndex];
    
    currentWeekDisplay.textContent = `Hafta ${currentWeekIndex + 1}`;
    prevWeekBtn.disabled = currentWeekIndex === 0;
    nextWeekBtn.disabled = currentWeekIndex === weeksInMonth.length - 1;
    
    // 5 sütun oluştur
    for (let i = 0; i < 5; i++) {
        const dayData = weekData.find(d => d.dayIndex === i);
        const colDiv = document.createElement('div');
        colDiv.className = 'day-column';
        
        if (dayData) {
            const acts = activitiesData[dayData.dateKey] || ["", "", ""];
            
            colDiv.innerHTML = `
                <div class="date-header">
                    <span class="day-name">${dayData.dayName}</span>
                    <span class="date-text">${dayData.dateText}</span>
                </div>
                <div class="activities-box">
                    <div class="fixed-activity top-activity">Sabah Sporu</div>
                    <div class="editable-activities">
                        <div class="activity-item" contenteditable="true" placeholder="Etkinlik girin..." data-date="${dayData.dateKey}" data-index="0">${acts[0]}</div>
                        <div class="activity-item" contenteditable="true" placeholder="Etkinlik girin..." data-date="${dayData.dateKey}" data-index="1">${acts[1]}</div>
                        <div class="activity-item" contenteditable="true" placeholder="Etkinlik girin..." data-date="${dayData.dateKey}" data-index="2">${acts[2]}</div>
                    </div>
                    <div class="fixed-activity bottom-activity">Günü Değerlendirme Saati</div>
                </div>
            `;
            
            // ContentEditable için event listener
            const editables = colDiv.querySelectorAll('.activity-item');
            editables.forEach(editable => {
                editable.addEventListener('blur', (e) => {
                    let text = e.target.innerText.trim();
                    // Tamamen silindiyse CSS :empty seçicisinin çalışması için içini tamamen boşalt (br etiketlerini temizle)
                    if (text === "") {
                        e.target.innerHTML = "";
                        text = "";
                    }
                    const dKey = e.target.getAttribute('data-date');
                    const idx = e.target.getAttribute('data-index');
                    saveActivity(dKey, parseInt(idx), text);
                });
                
                editable.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); // Enter tuşunu engelle (satır atlamasın, div kırmasın)
                        e.target.blur(); // Odaktan çık
                    }
                });
            });

        } else {
            // Boş gün (Ayın başı/sonu hafta içine denk gelmeyen günler)
            colDiv.innerHTML = `
                <div class="date-header"></div>
                <div class="activities-box"></div>
            `;
        }
        
        planGrid.appendChild(colDiv);
    }
}

// Verileri Temizle
function clearData() {
    if(confirm("Tüm kayıtlı etkinlikleri silmek istediğinize emin misiniz?")) {
        activitiesData = {};
        localStorage.removeItem('weeklyPlannerData');
        renderGrid();
    }
}

// Export Fonksiyonları


async function exportPDF() {
    try {
        exportContent.classList.add('exporting');
        const { jsPDF } = window.jspdf;
        let pdf;
        
        const originalWeekIndex = currentWeekIndex;
        
        // Ayın tüm haftalarını döngü ile pdf'e sayfa olarak ekle
        for (let i = 0; i < weeksInMonth.length; i++) {
            currentWeekIndex = i;
            renderGrid();
            
            // DOM güncellemelerinin yansıması için çok kısa bir bekleme süresi
            await new Promise(r => setTimeout(r, 150));
            
            const canvas = await html2canvas(exportContent, { scale: 2, useCORS: true, backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            
            if (i === 0) {
                // PDF sayfasını A4 yerine doğrudan resmin kendi ölçülerine (16:9) göre oluştur
                // Böylece altta veya üstte hiçbir şekilde beyaz boşluk kalmaz
                pdf = new jsPDF({
                    orientation: 'l',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
            } else {
                pdf.addPage([canvas.width, canvas.height], 'l');
            }
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
        
        // İşlem bitince orijinal haftaya geri dön
        currentWeekIndex = originalWeekIndex;
        renderGrid();
        exportContent.classList.remove('exporting');
        
        const monthName = MONTHS[currentMonth];
        pdf.save(`${monthName}-${currentYear}-Tum-Haftalar.pdf`);
    } catch (e) {
        exportContent.classList.remove('exporting');
        alert("PDF oluşturulurken hata: " + e.message);
    }
}



// Başlat
init();
