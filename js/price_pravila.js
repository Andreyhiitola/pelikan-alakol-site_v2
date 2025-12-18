// js/price_pravila.js — Финальная версия
let priceJson = null;

// --- ЗАГРУЗКА ПРАВИЛ ---
async function loadRulesJson() {
    const body = document.getElementById('docsModalBody');
    body.innerHTML = '<p>Загрузка правил...</p>';
    
    try {
        const resp = await fetch('rules.json');
        if (!resp.ok) throw new Error('Файл rules.json не найден');
        const data = await resp.json();
        
        console.log('Rules data:', data);

        let html = '';

        if (data.sections && Array.isArray(data.sections)) {
            data.sections.forEach(section => {
                html += `<h3 style="color:#2d8659; margin-top:15px;">${section.title}</h3>`;
                if (section.items && Array.isArray(section.items)) {
                    html += '<ul style="padding-left:20px;">';
                    section.items.forEach(item => html += `<li style="margin-bottom:5px;">${item}</li>`);
                    html += '</ul>';
                }
            });
        } 
        else if (Array.isArray(data)) {
            html += '<ul>';
            data.forEach(line => html += `<li>${line}</li>`);
            html += '</ul>';
        }
        else {
            html = '<p>Не удалось распознать формат правил.</p>';
        }

        body.innerHTML = `<div class="rules-content">${html}</div>`;

    } catch (e) {
        console.error(e);
        body.innerHTML = `<div class="error" style="color:red;">Ошибка при загрузке: ${e.message}</div>`;
    }
}

// --- ЗАГРУЗКА ПРАЙСА ---
async function loadPriceJson() {
    const body = document.getElementById('docsModalBody');
    body.innerHTML = '<p>Загрузка прайса...</p>';

    try {
        if (!priceJson) {
            const resp = await fetch('price.json');
            if (!resp.ok) throw new Error('Файл price.json не найден');
            priceJson = await resp.json();
        }
        renderPriceFromJson('all');
    } catch (e) {
        console.error(e);
        body.innerHTML = `<div class="error" style="color:red;">Ошибка при загрузке: ${e.message}</div>`;
    }
}

// --- ОТРИСОВКА ПРАЙСА ---
function renderPriceFromJson(mode) {
    const body = document.getElementById('docsModalBody');
    if (!priceJson) return;

    const periods = priceJson.periods || [];
    const rooms = priceJson.rooms || [];

    const btnStyle = "padding:8px 15px; margin:5px; border:1px solid #2d8659; border-radius:5px; background:white; cursor:pointer;";
    const activeBtnStyle = "padding:8px 15px; margin:5px; border:1px solid #2d8659; border-radius:5px; background:#2d8659; color:white; cursor:pointer;";

    // 1. Фильтры
    let filtersHtml = `<div class="filters" style="text-align:center; margin-bottom:15px;">`;
    filtersHtml += `<button style="${mode === 'all' ? activeBtnStyle : btnStyle}" onclick="renderPriceFromJson('all')">Все периоды</button>`;
    
    periods.forEach(p => {
        const isActive = (mode == p.id);
        filtersHtml += `<button style="${isActive ? activeBtnStyle : btnStyle}" onclick="renderPriceFromJson(${p.id})">${p.label}</button>`;
    });
    filtersHtml += `</div>`;

    // 2. Таблица
    let html = `<table style="width:100%; border-collapse:collapse; margin-top:10px;">`;
    
    // Шапка таблицы
    html += `<thead><tr style="background:#f0f0f0;">`;
    html += `<th style="padding:4px; border:1px solid #ddd; font-size:14px; font-weight:normal;">Категория номера</th>`;
    periods.forEach(p => {
        if (mode === 'all' || mode == p.id) {
            html += `<th style="padding:4px; border:1px solid #ddd; font-size:14px; font-weight:normal;">${p.label}</th>`;
        }
    });
    html += `</tr></thead><tbody>`;

    // Тело таблицы
    rooms.forEach(room => {
        html += `<tr>`;
        html += `<td style="padding:4px; border:1px solid #ddd; font-size:14px;">${room.name}</td>`;
        
        periods.forEach(p => {
            if (mode === 'all' || mode == p.id) {
                let val = '-';
                if (room.prices && room.prices[p.id]) {
                    val = room.prices[p.id];
                }
                html += `<td style="padding:4px; border:1px solid #ddd; text-align:center; color:#e74c3c; font-size:14px;">${val}</td>`;
            }
        });
        html += `</tr>`;
    });
    html += `</tbody></table>`;

    // Примечание
    if (priceJson.note) {
        html += `<p style="margin-top:20px; font-style:italic; color:#666;">${priceJson.note}</p>`;
    }

    body.innerHTML = filtersHtml + html;
}

// --- УПРАВЛЕНИЕ ОКНОМ ---
function openDocsModal(type) {
    const modal = document.getElementById('docsModal');
    const title = document.getElementById('docsModalTitle');
    
    if (!modal) {
        console.error('Ошибка: элемент #docsModal не найден в HTML!');
        return;
    }

    modal.classList.add('active');
    modal.style.display = 'flex';

    if (type === 'rules') {
        title.innerHTML = '<i class="fas fa-file-contract"></i> Правила проживания';
        loadRulesJson();
    } else if (type === 'price') {
        title.innerHTML = '<i class="fas fa-tag"></i> Стоимость проживания <a href="price.pdf" target="_blank" style="font-size:14px; color:#0066cc; margin-left:15px; text-decoration:none;">Полный прайс в PDF <i class="fas fa-download"></i></a>';
        loadPriceJson();
    }
}

function closeDocsModal() {
    const modal = document.getElementById('docsModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

window.renderPriceFromJson = renderPriceFromJson;

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('docsModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDocsModal();
        });
    }
});
