const textFiles = {
    price: 'docs/price.pdf', 
    rules: 'docs/rules.txt'
};

const modalTitles = {
    price: "💰 Прайс-лист 2025",
    rules: "📜 Правила проживания"
};

// --- Функция закрытия ---
function closeTextModal() {
    const modal = document.getElementById('textModal');
    const content = document.getElementById('textModalContent');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сброс стилей "полного экрана" при закрытии
        const dialog = content.parentElement;
        if(dialog) {
            dialog.style.maxWidth = '';
            dialog.style.width = '';
            dialog.style.height = '';
            dialog.style.margin = '';
            dialog.style.borderRadius = '';
            dialog.style.top = '';
            delete dialog.dataset.fullscreen;
        }

        setTimeout(() => { if (content) content.innerHTML = ''; }, 300);
    }
}

// --- Функция: Развернуть / Свернуть ---
function togglePdfFullscreen() {
    const content = document.getElementById('textModalContent');
    const dialog = content.parentElement; 
    const pdfContainer = document.getElementById('pdfContainer');
    const icon = document.getElementById('expandIcon');
    
    const isFullscreen = dialog.dataset.fullscreen === 'true';

    if (!isFullscreen) {
        // >> РАЗВОРАЧИВАЕМ
        dialog.style.maxWidth = '100vw';
        dialog.style.width = '100vw';
        dialog.style.height = '100vh';
        dialog.style.margin = '0';
        dialog.style.borderRadius = '0';
        dialog.style.top = '0';
        
        if (pdfContainer) pdfContainer.style.height = '100vh';
        
        // Меняем иконку "Крест из стрелок" -> на "Сжатие"
        if (icon) {
            icon.classList.remove('fa-arrows-alt');
            icon.classList.add('fa-compress');
        }
        
        dialog.dataset.fullscreen = 'true';

    } else {
        // >> СВОРАЧИВАЕМ ОБРАТНО
        dialog.style.maxWidth = '';
        dialog.style.width = '';
        dialog.style.height = '';
        dialog.style.margin = '';
        dialog.style.borderRadius = '';
        dialog.style.top = '';
        
        if (pdfContainer) pdfContainer.style.height = '85vh';
        
        // Меняем иконку обратно на "Крест из стрелок"
        if (icon) {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-arrows-alt');
        }
        
        dialog.dataset.fullscreen = 'false';
    }
}

function openTextModal(type) {
    const modal = document.getElementById('textModal');
    const title = document.getElementById('textModalTitle');
    const content = document.getElementById('textModalContent');
    const fileName = textFiles[type];

    if (!fileName) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    // --- ЛОГИКА ДЛЯ PDF ---
    if (fileName.endsWith('.pdf')) {
        if(title) title.innerText = ""; 
        
        content.innerHTML = `
            <div id="pdfContainer" style="position: relative; width: 100%; height: 85vh; transition: height 0.3s;">
                
                <!-- Кнопка 1: РАЗВЕРНУТЬ (Зеленая) -->
                <!-- right: 60px (сдвинута левее от крестика закрытия) -->
                <button onclick="togglePdfFullscreen()" title="На весь экран" style="
                    position: absolute;
                    top: -25px; 
                    right: 60px; 
                    z-index: 1001;
                    background: #2d8659; 
                    color: white;
                    border: 2px solid white;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <!-- Иконка: крест из стрелок -->
                    <i id="expandIcon" class="fas fa-arrows-alt"></i>
                </button>

                <!-- Кнопка 2: ЗАКРЫТЬ (Красная) -->
                <button onclick="closeTextModal()" title="Закрыть" style="
                    position: absolute;
                    top: -25px;
                    right: -10px;
                    z-index: 1001;
                    background: #ff4d4d;
                    color: white;
                    border: 2px solid white;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    font-size: 20px;
                    line-height: 32px;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">&times;</button>

                <iframe src="${fileName}#view=FitH" style="
                    width: 100%; 
                    height: 100%; 
                    border: none; 
                    border-radius: 8px;
                    background: #f0f0f0;
                "></iframe>
                
                <div style="text-align: center; margin-top: 5px;">
                     <a href="${fileName}" target="_blank" style="color: #666; font-size: 12px; text-decoration: underline;">
                        Открыть PDF в новой вкладке
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // --- ЛОГИКА ДЛЯ ТЕКСТА ---
    if(title) title.innerText = modalTitles[type] || "Информация";
    content.innerHTML = '<div style="text-align:center; padding: 30px;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

    fetch(fileName)
        .then(res => res.text())
        .then(text => { content.innerHTML = text.replace(/\n/g, '<br>'); })
        .catch(err => { content.innerHTML = "Ошибка загрузки"; });
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('textModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTextModal();
        });
    }
});
