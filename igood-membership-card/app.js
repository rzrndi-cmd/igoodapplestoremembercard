/**
 * Mobile-First Application Engine for iGood Apple Store Kebumen
 */

const DB_KEY = 'igood_members_db';
const COUNTER_KEY = 'igood_counter_id';

let currentMemberData = null;
let frontCardCanvas = null;
let backCardCanvas = null;

document.addEventListener('DOMContentLoaded', () => {
  initSignaturePad();
  initDateDefaults();
  initLiveInputs();
  loadMobileMemberList();
});

/* =========================================================
   1. TOUCH & MOUSE SIGNATURE PAD (RETINA/DPR OPTIMIZED)
   ========================================================= */
let sigCanvas, sigCtx;
let isDrawing = false;
let hasSigned = false;

function initSignaturePad() {
  sigCanvas = document.getElementById('signaturePad');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');

  setupCanvasResolution();
  window.addEventListener('resize', setupCanvasResolution);

  // Mouse Events
  sigCanvas.addEventListener('mousedown', (e) => startDraw(e.clientX, e.clientY));
  sigCanvas.addEventListener('mousemove', (e) => drawMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', endDraw);

  // Touch Events (Cegah scrolling layar saat menggores)
  sigCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    startDraw(t.clientX, t.clientY);
  }, { passive: false });

  sigCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    drawMove(t.clientX, t.clientY);
  }, { passive: false });

  sigCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    endDraw();
  }, { passive: false });
}

function setupCanvasResolution() {
  const rect = sigCanvas.getBoundingClientRect();
  if (rect.width === 0) return;

  const dpr = window.devicePixelRatio || 1;
  const oldData = hasSigned ? sigCanvas.toDataURL() : null;

  sigCanvas.width = rect.width * dpr;
  sigCanvas.height = rect.height * dpr;

  sigCtx.scale(dpr, dpr);
  sigCtx.strokeStyle = '#0b0c10';
  sigCtx.lineWidth = 2.5;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';

  if (oldData) {
    const img = new Image();
    img.onload = () => sigCtx.drawImage(img, 0, 0, rect.width, rect.height);
    img.src = oldData;
  }
}

function getPos(clientX, clientY) {
  const rect = sigCanvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function startDraw(clientX, clientY) {
  isDrawing = true;
  hasSigned = true;
  const p = getPos(clientX, clientY);
  sigCtx.beginPath();
  sigCtx.moveTo(p.x, p.y);
}

function drawMove(clientX, clientY) {
  if (!isDrawing) return;
  const p = getPos(clientX, clientY);
  sigCtx.lineTo(p.x, p.y);
  sigCtx.stroke();
}

function endDraw() {
  if (isDrawing) {
    isDrawing = false;
    sigCtx.closePath();
    updateLiveSigPreview();
  }
}

function clearSignature() {
  const rect = sigCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  sigCtx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);
  hasSigned = false;

  const preview = document.getElementById('cbSigImg');
  if (preview) {
    preview.src = '';
    preview.style.display = 'none';
  }
}

function updateLiveSigPreview() {
  const preview = document.getElementById('cbSigImg');
  if (preview && hasSigned) {
    preview.src = sigCanvas.toDataURL('image/png');
    preview.style.display = 'block';
  }
}

/* =========================================================
   2. FORM & REAL-TIME INPUTS
   ========================================================= */
function initDateDefaults() {
  const birth = document.getElementById('regBirthDate');
  if (birth) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 20);
    birth.value = d.toISOString().split('T')[0];
  }
}

function initLiveInputs() {
  const nameInput = document.getElementById('regName');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const val = nameInput.value.trim() || 'NAMA PELANGGAN';
      document.getElementById('cfName').innerText = val.toUpperCase();
    });
  }

  const form = document.getElementById('memberForm');
  if (form) {
    form.addEventListener('submit', handleMobileSubmit);
  }
}

function generateMemberId() {
  const year = new Date().getFullYear();
  let counter = parseInt(localStorage.getItem(COUNTER_KEY) || '101', 10);
  counter++;
  localStorage.setItem(COUNTER_KEY, counter.toString());
  return `IG-KBM-${year}-${String(counter).padStart(4, '0')}`;
}

function getValidityPeriod() {
  const now = new Date();
  const next = new Date(now);
  next.setFullYear(now.getFullYear() + 1);

  const pad = (n) => String(n).padStart(2, '0');
  const start = `${pad(now.getMonth() + 1)}/${String(now.getFullYear()).slice(-2)}`;
  const end = `${pad(next.getMonth() + 1)}/${String(next.getFullYear()).slice(-2)}`;
  return `${start} - ${end}`;
}

async function handleMobileSubmit(e) {
  e.preventDefault();

  if (!hasSigned) {
    alert('⚠️ Mohon goreskan tanda tangan digital di kotak tanda tangan sebelum melanjutkan.');
    return;
  }

  const agree = document.getElementById('agreeTerms').checked;
  if (!agree) {
    alert('⚠️ Anda wajib menyetujui Syarat & Ketentuan Layanan.');
    return;
  }

  const name = document.getElementById('regName').value.trim();
  const ktp = document.getElementById('regKtp').value.trim();
  const birth = document.getElementById('regBirthDate').value;
  let phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const imei = document.getElementById('regImei').value.trim() || 'Unit Toko iGood Kebumen';

  phone = phone.replace(/^0/, '62').replace(/[^\d]/g, '');
  if (!phone.startsWith('62')) {
    phone = '62' + phone;
  }

  const memberId = generateMemberId();
  const validity = getValidityPeriod();
  const regDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const sigDataUrl = sigCanvas.toDataURL('image/png');

  currentMemberData = {
    id: memberId,
    name,
    ktp,
    birth,
    phone,
    email,
    imei,
    validity,
    regDate,
    sigDataUrl,
    fee: 'Rp 25.000',
    status: 'ACTIVE'
  };

  // Simpan ke DB Lokal
  saveMember(currentMemberData);

  // Generate High-Res Cards
  await generateBothCards(currentMemberData);

  // Update Tampilan Hasil di Mobile
  renderResultElements(currentMemberData);

  // Siapkan tombol pengiriman WA & Email
  setupMobileDelivery(currentMemberData);

  // Buka Tab Kartu Saya & Scroll ke atas
  switchMobileTab('view-card');
  const contentArea = document.querySelector('.mobile-content');
  if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });

  loadMobileMemberList();
}

/* =========================================================
   3. HIGH-RES CANVAS GENERATOR INTEGRATION
   ========================================================= */
async function generateBothCards(data) {
  const sigImg = new Image();
  await new Promise((res) => {
    sigImg.onload = res;
    sigImg.src = data.sigDataUrl;
  });

  const qrImg = new Image();
  qrImg.crossOrigin = 'anonymous';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('https://igoodstore.id/verify?id=' + data.id + '&name=' + encodeURIComponent(data.name))}`;
  
  await new Promise((res) => {
    qrImg.onload = res;
    qrImg.onerror = res;
    qrImg.src = qrUrl;
  });

  frontCardCanvas = CardGenerator.renderFront({
    name: data.name,
    memberId: data.id,
    validity: data.validity,
    qrImage: qrImg
  });

  backCardCanvas = CardGenerator.renderBack({
    signatureImage: sigImg
  });
}

function renderResultElements(data) {
  // Update Result View Elements
  document.getElementById('resCfName').innerText = data.name.toUpperCase();
  document.getElementById('resCfId').innerText = data.id;
  document.getElementById('resCfValid').innerText = data.validity;
  document.getElementById('resCfQrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.id)}`;

  const resSig = document.getElementById('resCbSigImg');
  if (resSig) {
    resSig.src = data.sigDataUrl;
  }

  // Meta Info
  document.getElementById('detailMemberId').innerText = data.id;
  document.getElementById('detailMemberName').innerText = data.name;
  document.getElementById('detailValidity').innerText = data.validity;
  document.getElementById('detailPhone').innerText = '+' + data.phone;
}

/* =========================================================
   4. DELIVERIES: WHATSAPP & EMAIL
   ========================================================= */
function setupMobileDelivery(data) {
  const waText = 
`*KARTU MEMBER DIGITAL iGOOD APPLE STORE KEBUMEN* 🍏✨

Halo Kak *${data.name}*,
Selamat! Kartu keanggotaan *Priority Care Member* Kakak telah resmi aktif.

Rincian Member:
━━━━━━━━━━━━━━━━━━━━
💳 *Nomor Member*: \`${data.id}\`
👤 *Nama*: ${data.name}
🗓️ *Masa Aktif*: ${data.validity} (1 Tahun)
📱 *Unit/IMEI*: ${data.imei}
━━━━━━━━━━━━━━━━━━━━

*KEUNTUNGAN KARTU INI:*
1. 🛡️ *Garansi Servis Mesin (Diskon 5% - 15%)*
   Mendapatkan potongan servis mesin bila terjadi human/user error untuk unit HP yang dibeli di toko.
2. 🎁 *Cash Reward Referral Rp 25.000*
   Dapatkan bonus Rp 25.000 setiap membawa teman/keluarga yang beli unit baru di iGood Kebumen!

Tunjukkan pesan/kartu ini saat berkunjung ke store kami.

📍 *iGood Apple Store Kebumen*`;

  const btnWa = document.getElementById('btnSendWa');
  if (btnWa) {
    btnWa.href = `https://wa.me/${data.phone}?text=${encodeURIComponent(waText)}`;
    btnWa.target = '_blank';
  }

  const btnEmail = document.getElementById('btnSendEmail');
  if (btnEmail) {
    const subject = `[iGood Kebumen] Kartu Priority Member - ${data.id}`;
    btnEmail.href = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(waText)}`;
  }
}

function downloadBothCards() {
  if (!currentMemberData || !frontCardCanvas) {
    alert('Silakan terbitkan kartu terlebih dahulu.');
    return;
  }

  // Download Front
  const l1 = document.createElement('a');
  l1.download = `iGood_Card_Front_${currentMemberData.id}.png`;
  l1.href = frontCardCanvas.toDataURL('image/png');
  l1.click();

  // Download Back
  setTimeout(() => {
    const l2 = document.createElement('a');
    l2.download = `iGood_Card_Back_${currentMemberData.id}.png`;
    l2.href = backCardCanvas.toDataURL('image/png');
    l2.click();
  }, 400);
}

/* =========================================================
   5. LOCAL DATABASE & EXPORT
   ========================================================= */
function saveMember(m) {
  const list = getMemberList();
  list.unshift(m);
  localStorage.setItem(DB_KEY, JSON.stringify(list));
}

function getMemberList() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : [];
}

function loadMobileMemberList() {
  const container = document.getElementById('mMemberList');
  if (!container) return;

  const list = getMemberList();
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-sub); padding: 40px 10px; font-size: 12px;">
        Belum ada member terdaftar.<br>Silakan daftarkan melalui tab "Daftar".
      </div>`;
    return;
  }

  container.innerHTML = list.map(m => `
    <div class="m-member-item" onclick="openMemberDetail('${m.id}')">
      <div class="m-item-info">
        <span class="m-item-name">${m.name}</span>
        <span class="m-item-id">${m.id}</span>
        <span class="m-item-phone">WA: +${m.phone}</span>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 10px; color: var(--green); font-weight: 700; background: rgba(48,209,88,0.12); padding: 3px 8px; border-radius: 20px;">AKTIF</span>
      </div>
    </div>
  `).join('');
}

function openMemberDetail(id) {
  const list = getMemberList();
  const m = list.find(x => x.id === id);
  if (!m) return;

  currentMemberData = m;
  generateBothCards(m).then(() => {
    renderResultElements(m);
    setupMobileDelivery(m);
    switchMobileTab('view-card');
  });
}

function exportToCsv() {
  const list = getMemberList();
  if (list.length === 0) {
    alert('Belum ada data untuk diekspor.');
    return;
  }

  let csv = 'No,ID Member,Nama,No KTP,Tanggal Lahir,WhatsApp,Email,IMEI Unit,Masa Berlaku,Status\n';
  list.forEach((m, idx) => {
    csv += `${idx + 1},"${m.id}","${m.name}","'${m.ktp}","${m.birth}","'${m.phone}","${m.email}","${m.imei}","${m.validity}","${m.status}"\n`;
  });

  const uri = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  const a = document.createElement('a');
  a.href = uri;
  a.download = `Member_iGood_Kebumen_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* =========================================================
   6. NAVIGATION & MODALS
   ========================================================= */
function switchMobileTab(viewId) {
  // Update Tab Buttons
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === viewId);
  });

  // Switch Views
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.style.display = (panel.id === viewId) ? 'block' : 'none';
  });

  if (viewId === 'view-database') {
    loadMobileMemberList();
  }
}

function toggleCardFlip() {
  const c1 = document.getElementById('interactiveCardInner');
  const c2 = document.getElementById('resultCardInner');
  if (c1) c1.classList.toggle('flipped');
  if (c2) c2.classList.toggle('flipped');
}

function openTermsModal() {
  document.getElementById('termsModal').classList.add('active');
}

function closeTermsModal() {
  document.getElementById('termsModal').classList.remove('active');
}
