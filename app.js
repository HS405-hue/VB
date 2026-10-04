// State & Data Store
const STORAGE_KEY = 'life_vision_board_data_v1';

let state = {
  boardTitle: 'My Ultimate Life Vision Board 2026-2030',
  theme: 'midnight',
  cards: []
};

// Default Preset Cards for demonstration & quick start
const presetCards = [
  {
    id: 'card-fin-1',
    type: 'finance',
    title: '💰 เป้าหมายการเงิน & รายจ่าย',
    data: {
      targetSavings: '1,000,000',
      currentSavings: '250,000',
      monthlyIncome: '65,000',
      expenses: [
        { name: 'ค่าที่พัก / คอนโด', amount: 12000 },
        { name: 'อาหารและการเดินทาง', amount: 9000 },
        { name: 'ลงทุน DCA หุ้น / กองทุน', amount: 15000 },
        { name: 'เงินออมฉุกเฉิน', amount: 5000 }
      ]
    }
  },
  {
    id: 'card-goal-1',
    type: 'goals',
    title: '🎯 เป้าหมายชีวิต 3-5 ปีข้างหน้า',
    data: {
      items: [
        { text: 'ซื้อบ้านหรือคอนโดทำเลติดรถไฟฟ้า', done: false },
        { text: 'ท่องเที่ยวญี่ปุ่น / ยุโรป ปีละ 1 ครั้ง', done: true },
        { text: 'มีเงินเก็บสำรองฉุกเฉิน 6 เดือน', done: true },
        { text: 'สร้าง Passive Income เดือนละ 20,000+', done: false }
      ]
    }
  },
  {
    id: 'card-car-1',
    type: 'career',
    title: '💼 การงาน & เส้นทางอาชีพ',
    data: {
      items: [
        { text: 'เลื่อนตำแหน่งเป็น Senior Lead Specialist', done: false },
        { text: 'สอบใบรับรอง Professional Certificate', done: true },
        { text: 'พัฒนาทักษะ AI & Automation Tools', done: false },
        { text: 'เริ่มทำ Side Project สร้างรายได้เสริม', done: true }
      ]
    }
  },
  {
    id: 'card-bel-1',
    type: 'beliefs',
    title: '🧘 ความเชื่อ, ทัศนคติ & คุณค่า (Values)',
    data: {
      quote: '"ความสม่ำเสมอชนะความสมบูรณ์แบบเสมอ การลงมือทำทีละก้าวคือความสำเร็จ"',
      values: ['ความสุขสงบ', 'การเติบโตต่อเนื่อง', 'ความซื่อสัตย์', 'อิสรภาพ']
    }
  },
  {
    id: 'card-lif-1',
    type: 'lifestyle',
    title: '🌱 วิถีชีวิต สุขภาพ และความสุข',
    data: {
      items: [
        { text: 'นอนหลับให้ครบ 7-8 ชั่วโมงทุกวัน', done: true },
        { text: 'ออกกำลังกายสัปดาห์ละ 3 ครั้ง (วิ่ง/เวท)', done: false },
        { text: 'อ่านหนังสือพัฒนาตนเองเดือนละ 1 เล่ม', done: true },
        { text: 'ทานอาหารคลีน & ดื่มน้ำ 2.5 ลิตรต่อวัน', done: false }
      ]
    }
  },
  {
    id: 'card-img-1',
    type: 'image-quote',
    title: '🖼️ ภาพบันดาลใจ & สถานที่ในฝัน',
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      caption: 'บ้านพักริมทะเล บรรยากาศเงียบสงบพร้อมวิวพระอาทิตย์ตก'
    }
  }
];

// DOM Elements
const canvas = document.getElementById('boardCanvas');
const emptyState = document.getElementById('emptyState');
const boardTitleInput = document.getElementById('boardTitleInput');
const saveStatus = document.getElementById('saveStatus');
const themeSelect = document.getElementById('themeSelect');

// Stats Elements
const statCardCount = document.getElementById('statCardCount');
const statFinanceTotal = document.getElementById('statFinanceTotal');
const statTasksDone = document.getElementById('statTasksDone');

// Buttons
const addPresetDemoBtn = document.getElementById('addPresetDemoBtn');
const clearBoardBtn = document.getElementById('clearBoardBtn');
const printBoardBtn = document.getElementById('printBoardBtn');
const exportBoardBtn = document.getElementById('exportBoardBtn');
const importBoardBtn = document.getElementById('importBoardBtn');
const importFileInput = document.getElementById('importFileInput');
const paletteItems = document.querySelectorAll('.palette-item');

// Initialize
function init() {
  loadFromStorage();
  applyTheme(state.theme || 'midnight');
  setupEventListeners();
  renderBoard();
}

// Apply Color Theme
function applyTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  if (themeSelect) {
    themeSelect.value = themeName;
  }
}

// Load data from LocalStorage
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = parsed;
      boardTitleInput.value = state.boardTitle || 'My Ultimate Life Vision Board';
      if (!state.theme) state.theme = 'midnight';
    } else {
      // Default to preset on first open
      state.cards = JSON.parse(JSON.stringify(presetCards));
      state.theme = 'midnight';
    }
  } catch (e) {
    console.error('Failed to load storage:', e);
    state.cards = JSON.parse(JSON.stringify(presetCards));
    state.theme = 'midnight';
  }
}

// Save data to LocalStorage
function saveToStorage() {
  state.boardTitle = boardTitleInput.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  showSavedStatus();
  updateSummaryStats();
}

function showSavedStatus() {
  saveStatus.style.opacity = '1';
  saveStatus.textContent = '💾 บันทึกอัตโนมัติแล้ว';
  setTimeout(() => {
    saveStatus.style.opacity = '0.6';
  }, 1500);
}

// Setup Event Listeners
function setupEventListeners() {
  boardTitleInput.addEventListener('input', saveToStorage);

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      state.theme = selectedTheme;
      applyTheme(selectedTheme);
      saveToStorage();
    });
  }

  // Palette Drag & Add events
  paletteItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.type);
    });

    const addBtn = item.querySelector('.add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addCard(item.dataset.type);
      });
    }

    item.addEventListener('click', () => {
      addCard(item.dataset.type);
    });
  });

  // Canvas Drag & Drop
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvas.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', () => {
    canvas.classList.remove('drag-over');
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    const type = e.dataTransfer.getData('text/plain');
    if (type) {
      addCard(type);
    }
  });

  // Topbar Actions
  addPresetDemoBtn.addEventListener('click', () => {
    if (confirm('คุณต้องการโหลดชุดข้อมูลตัวอย่างใช่หรือไม่? (การ์ดปัจจุบันจะถูกแทนที่)')) {
      state.cards = JSON.parse(JSON.stringify(presetCards));
      saveToStorage();
      renderBoard();
    }
  });

  clearBoardBtn.addEventListener('click', () => {
    if (confirm('แน่ใจหรือไม่ว่าต้องการล้างการ์ดทั้งหมดบน Vision Board?')) {
      state.cards = [];
      saveToStorage();
      renderBoard();
    }
  });

  printBoardBtn.addEventListener('click', () => {
    window.print();
  });

  // Export & Import
  exportBoardBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vision-board-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  importBoardBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && Array.isArray(imported.cards)) {
          state = imported;
          boardTitleInput.value = state.boardTitle || 'My Ultimate Life Vision Board';
          applyTheme(state.theme || 'midnight');
          saveToStorage();
          renderBoard();
          alert('นำเข้า Vision Board สำเร็จเรียบร้อย!');
        } else {
          alert('รูปแบบไฟล์ไม่ถูกต้อง');
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
}

// Add New Card by Type
function addCard(type) {
  const newCard = {
    id: 'card-' + Date.now(),
    type: type,
    title: getDefaultTitle(type),
    data: getDefaultData(type)
  };
  state.cards.push(newCard);
  saveToStorage();
  renderBoard();
}

function getDefaultTitle(type) {
  switch (type) {
    case 'finance': return '💰 เป้าหมายการเงิน & งบประมาณ';
    case 'career': return '💼 เส้นทางอาชีพ & การงาน';
    case 'goals': return '🎯 เป้าหมายความสำเร็จ (Goals)';
    case 'beliefs': return '🧘 ความเชื่อ, วิสัยทัศน์ & ทัศนคติ';
    case 'lifestyle': return '🌱 วิถีชีวิต สุขภาพ & กิจวัตร';
    case 'image-quote': return '🖼️ ภาพบันดาลใจ & สิ่งที่ปรารถนา';
    default: return '📌 การ์ดวางแผน';
  }
}

function getDefaultData(type) {
  switch (type) {
    case 'finance':
      return {
        targetSavings: '1,000,000',
        currentSavings: '0',
        monthlyIncome: '50,000',
        expenses: [
          { name: 'ค่าใช้จ่ายจำเป็น', amount: 15000 },
          { name: 'เงินเก็บ / ลงทุน', amount: 10000 }
        ]
      };
    case 'career':
    case 'goals':
    case 'lifestyle':
      return {
        items: [
          { text: 'เพิ่มเป้าหมายแรกของคุณที่นี่...', done: false }
        ]
      };
    case 'beliefs':
      return {
        quote: 'ใส่คำคมหรือแนวคิดชี้นำชีวิตของคุณ...',
        values: ['ความซื่อสัตย์', 'ความสุข', 'ความก้าวหน้า']
      };
    case 'image-quote':
      return {
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        caption: 'ออกเดินทางค้นหาประสบการณ์ใหม่ๆ'
      };
    default:
      return {};
  }
}

// Delete Card
function deleteCard(id) {
  state.cards = state.cards.filter(c => c.id !== id);
  saveToStorage();
  renderBoard();
}

// Render Board Canvas
function renderBoard() {
  // Clear canvas except emptyState
  canvas.innerHTML = '';

  if (state.cards.length === 0) {
    canvas.appendChild(emptyState);
    emptyState.style.display = 'flex';
  } else {
    state.cards.forEach((card, index) => {
      const cardEl = createCardElement(card, index);
      canvas.appendChild(cardEl);
    });
  }

  updateSummaryStats();
}

// Build Card Element
function createCardElement(card, index) {
  const cardDiv = document.createElement('div');
  cardDiv.className = `vision-card card-${card.type}`;
  cardDiv.setAttribute('draggable', 'true');
  cardDiv.dataset.id = card.id;

  // Drag & drop reordering on canvas
  cardDiv.addEventListener('dragstart', (e) => {
    cardDiv.classList.add('is-dragging');
    e.dataTransfer.setData('text/card-id', card.id);
  });

  cardDiv.addEventListener('dragend', () => {
    cardDiv.classList.remove('is-dragging');
  });

  cardDiv.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  cardDiv.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/card-id');
    if (draggedId && draggedId !== card.id) {
      const fromIdx = state.cards.findIndex(c => c.id === draggedId);
      const toIdx = state.cards.findIndex(c => c.id === card.id);
      if (fromIdx !== -1 && toIdx !== -1) {
        const [movedCard] = state.cards.splice(fromIdx, 1);
        state.cards.splice(toIdx, 0, movedCard);
        saveToStorage();
        renderBoard();
      }
    }
  });

  // Card Header
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = `
    <div class="card-title-wrap">
      <input type="text" class="card-title-input" value="${escapeHtml(card.title)}">
    </div>
    <div class="card-actions">
      <button class="card-btn delete" title="ลบการ์ดนี้">✕</button>
    </div>
  `;

  const titleInput = header.querySelector('.card-title-input');
  titleInput.addEventListener('input', (e) => {
    card.title = e.target.value;
    saveToStorage();
  });

  const deleteBtn = header.querySelector('.card-btn.delete');
  deleteBtn.addEventListener('click', () => {
    if (confirm(`คุณต้องการลบการ์ด "${card.title}" หรือไม่?`)) {
      deleteCard(card.id);
    }
  });

  cardDiv.appendChild(header);

  // Card Body based on Type
  const body = document.createElement('div');
  body.className = 'card-body';

  switch (card.type) {
    case 'finance':
      renderFinanceBody(body, card);
      break;
    case 'career':
    case 'goals':
    case 'lifestyle':
      renderChecklistBody(body, card);
      break;
    case 'beliefs':
      renderBeliefsBody(body, card);
      break;
    case 'image-quote':
      renderImageBody(body, card);
      break;
  }

  cardDiv.appendChild(body);
  return cardDiv;
}

// 1. Finance Card UI
function renderFinanceBody(container, card) {
  const data = card.data;
  container.innerHTML = `
    <div class="finance-grid">
      <div class="finance-box">
        <label>🎯 เงินเก็บเป้าหมาย (บาท)</label>
        <input type="text" class="fin-target" value="${data.targetSavings || '0'}">
      </div>
      <div class="finance-box">
        <label>💵 เงินเก็บปัจจุบัน (บาท)</label>
        <input type="text" class="fin-current" value="${data.currentSavings || '0'}">
      </div>
      <div class="finance-box" style="grid-column: span 2;">
        <label>📈 รายรับโดยประมาณ / เดือน</label>
        <input type="text" class="fin-income" value="${data.monthlyIncome || '0'}">
      </div>
    </div>
    
    <div style="margin-top: 6px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:12px; font-weight:600; color:var(--text-muted);">รายการค่าใช้จ่าย & การออมต่อเดือน:</span>
        <span style="font-size:12px; color:var(--accent-yellow); font-weight:700;" class="expense-total">รวม: ฿0</span>
      </div>
      <div class="expense-list"></div>
      <button class="btn-add-item add-expense-btn" style="margin-top: 8px; width:100%;">+ เพิ่มรายการค่าใช้จ่าย</button>
    </div>
  `;

  const targetInput = container.querySelector('.fin-target');
  const currentInput = container.querySelector('.fin-current');
  const incomeInput = container.querySelector('.fin-income');
  const expenseList = container.querySelector('.expense-list');
  const addExpenseBtn = container.querySelector('.add-expense-btn');
  const totalLabel = container.querySelector('.expense-total');

  function calculateTotal() {
    let sum = 0;
    (data.expenses || []).forEach(exp => sum += Number(exp.amount) || 0);
    totalLabel.textContent = `รวม: ฿${sum.toLocaleString()}`;
  }

  targetInput.addEventListener('input', (e) => { data.targetSavings = e.target.value; saveToStorage(); });
  currentInput.addEventListener('input', (e) => { data.currentSavings = e.target.value; saveToStorage(); });
  incomeInput.addEventListener('input', (e) => { data.monthlyIncome = e.target.value; saveToStorage(); });

  function renderExpenses() {
    expenseList.innerHTML = '';
    (data.expenses || []).forEach((exp, idx) => {
      const row = document.createElement('div');
      row.className = 'expense-item';
      row.innerHTML = `
        <input type="text" placeholder="ชื่อรายการ เช่น ค่าอาหาร" value="${escapeHtml(exp.name)}">
        <span>฿</span>
        <input type="number" placeholder="จำนวน" value="${exp.amount || 0}">
        <button class="check-remove" title="ลบรายการ">✕</button>
      `;

      const nameInput = row.querySelectorAll('input')[0];
      const amountInput = row.querySelectorAll('input')[1];
      const removeBtn = row.querySelector('.check-remove');

      nameInput.addEventListener('input', (e) => { exp.name = e.target.value; saveToStorage(); });
      amountInput.addEventListener('input', (e) => { exp.amount = Number(e.target.value); calculateTotal(); saveToStorage(); });
      removeBtn.addEventListener('click', () => {
        data.expenses.splice(idx, 1);
        saveToStorage();
        renderExpenses();
      });

      expenseList.appendChild(row);
    });
    calculateTotal();
  }

  addExpenseBtn.addEventListener('click', () => {
    if (!data.expenses) data.expenses = [];
    data.expenses.push({ name: 'รายการใหม่', amount: 1000 });
    saveToStorage();
    renderExpenses();
  });

  renderExpenses();
}

// 2. Checklist (Goals, Career, Lifestyle) UI
function renderChecklistBody(container, card) {
  const data = card.data;
  if (!data.items) data.items = [];

  container.innerHTML = `
    <div class="checklist"></div>
    <button class="btn-add-item add-check-btn">+ เพิ่มรายการเป้าหมาย / กิจวัตร</button>
  `;

  const checklistEl = container.querySelector('.checklist');
  const addBtn = container.querySelector('.add-check-btn');

  function renderList() {
    checklistEl.innerHTML = '';
    data.items.forEach((item, idx) => {
      const itemRow = document.createElement('div');
      itemRow.className = `check-item ${item.done ? 'done' : ''}`;
      itemRow.innerHTML = `
        <input type="checkbox" ${item.done ? 'checked' : ''}>
        <input type="text" value="${escapeHtml(item.text)}">
        <button class="check-remove" title="ลบรายการ">✕</button>
      `;

      const cb = itemRow.querySelector('input[type="checkbox"]');
      const textInput = itemRow.querySelector('input[type="text"]');
      const removeBtn = itemRow.querySelector('.check-remove');

      cb.addEventListener('change', (e) => {
        item.done = e.target.checked;
        itemRow.classList.toggle('done', item.done);
        saveToStorage();
      });

      textInput.addEventListener('input', (e) => {
        item.text = e.target.value;
        saveToStorage();
      });

      removeBtn.addEventListener('click', () => {
        data.items.splice(idx, 1);
        saveToStorage();
        renderList();
      });

      checklistEl.appendChild(itemRow);
    });
  }

  addBtn.addEventListener('click', () => {
    data.items.push({ text: 'เป้าหมายใหม่...', done: false });
    saveToStorage();
    renderList();
  });

  renderList();
}

// 3. Beliefs & Mindset UI
function renderBeliefsBody(container, card) {
  const data = card.data;
  if (!data.values) data.values = ['พลังบวก', 'มีวินัย'];

  container.innerHTML = `
    <div>
      <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">✨ คำคมหรือปรัชญาประจำใจ:</label>
      <textarea class="mindset-textarea" placeholder="เขียนคำคมที่สร้างแรงผลักดันให้คุณ...">${escapeHtml(data.quote || '')}</textarea>
    </div>
    <div style="margin-top:4px;">
      <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:6px;">⭐ ค่านิยมและสิ่งที่ให้ความสำคัญ (Core Values):</label>
      <div class="values-tags"></div>
      <div style="display:flex; gap:6px; margin-top:8px;">
        <input type="text" class="new-tag-input" placeholder="+ เพิ่มค่านิยมใหม่ เช่น อิสรภาพ" style="flex:1; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); color:white; padding:4px 8px; border-radius:4px; font-size:12px; outline:none;">
        <button class="add-tag-btn" style="background:rgba(251,191,36,0.2); border:1px solid rgba(251,191,36,0.4); color:#fde68a; padding:0 10px; border-radius:4px; cursor:pointer; font-size:12px;">เพิ่ม</button>
      </div>
    </div>
  `;

  const textarea = container.querySelector('.mindset-textarea');
  const tagsContainer = container.querySelector('.values-tags');
  const newTagInput = container.querySelector('.new-tag-input');
  const addTagBtn = container.querySelector('.add-tag-btn');

  textarea.addEventListener('input', (e) => {
    data.quote = e.target.value;
    saveToStorage();
  });

  function renderTags() {
    tagsContainer.innerHTML = '';
    data.values.forEach((val, idx) => {
      const tag = document.createElement('div');
      tag.className = 'value-tag';
      tag.innerHTML = `<span>${escapeHtml(val)}</span> <span class="tag-del" title="ลบ">✕</span>`;
      tag.querySelector('.tag-del').addEventListener('click', () => {
        data.values.splice(idx, 1);
        saveToStorage();
        renderTags();
      });
      tagsContainer.appendChild(tag);
    });
  }

  function addTag() {
    const val = newTagInput.value.trim();
    if (val) {
      data.values.push(val);
      newTagInput.value = '';
      saveToStorage();
      renderTags();
    }
  }

  addTagBtn.addEventListener('click', addTag);
  newTagInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTag();
  });

  renderTags();
}

// 4. Image & Inspiration UI
function renderImageBody(container, card) {
  const data = card.data;
  container.innerHTML = `
    <div class="image-preview-container">
      <img src="${data.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}" alt="Vision image" onerror="this.src='https://via.placeholder.com/600x300?text=Invalid+Image+URL'">
    </div>
    <div class="image-input-row" style="margin-top:6px;">
      <input type="text" class="img-url-input" placeholder="วางลิงก์รูปภาพ (URL)" value="${escapeHtml(data.imageUrl || '')}">
      <button class="img-apply-btn">แสดงรูป</button>
    </div>
    <input type="text" class="img-caption-input" placeholder="คำบรรยายแรงบันดาลใจ..." value="${escapeHtml(data.caption || '')}" style="background:rgba(0,0,0,0.2); border:1px solid var(--border-color); color:var(--text-muted); padding:6px 8px; border-radius:4px; font-size:12px; outline:none; margin-top:4px;">
  `;

  const imgEl = container.querySelector('img');
  const urlInput = container.querySelector('.img-url-input');
  const applyBtn = container.querySelector('.img-apply-btn');
  const captionInput = container.querySelector('.img-caption-input');

  function updateImage() {
    const url = urlInput.value.trim();
    if (url) {
      data.imageUrl = url;
      imgEl.src = url;
      saveToStorage();
    }
  }

  applyBtn.addEventListener('click', updateImage);
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') updateImage();
  });

  captionInput.addEventListener('input', (e) => {
    data.caption = e.target.value;
    saveToStorage();
  });
}

// Update Overview Sidebar Stats
function updateSummaryStats() {
  statCardCount.textContent = `${state.cards.length} ชิ้น`;

  let totalFinanceTarget = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  state.cards.forEach(card => {
    if (card.type === 'finance') {
      const cleanVal = (card.data.targetSavings || '0').replace(/,/g, '');
      totalFinanceTarget += parseFloat(cleanVal) || 0;
    }
    if (card.data && Array.isArray(card.data.items)) {
      totalTasks += card.data.items.length;
      completedTasks += card.data.items.filter(i => i.done).length;
    }
  });

  statFinanceTotal.textContent = `฿${totalFinanceTarget.toLocaleString()}`;
  statTasksDone.textContent = `${completedTasks} / ${totalTasks}`;
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start app
document.addEventListener('DOMContentLoaded', init);
