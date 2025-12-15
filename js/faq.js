// js/faq-item.js - Загрузка и рендер FAQ из JSON
let faqData = null;

async function loadFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) {
        console.error('❌ #faqContainer не найден');
        return;
    }

    try {
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка вопросов...</div>';
        
        // ✅ ИСПРАВЛЕНО: правильный путь к файлу
        const response = await fetch('../faq.json');
        if (!response.ok) throw new Error(`faq.json не найден: ${response.status}`);
        
        faqData = await response.json();
        console.log('✅ FAQ загружен:', faqData.items.length, 'вопросов');
        
        renderFAQ();
    } catch (error) {
        console.error('❌ Ошибка загрузки FAQ:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3em;"></i>
                <p>Не удалось загрузить вопросы</p>
                <p style="font-size: 0.9em;">${error.message}</p>
            </div>
        `;
    }
}

function renderFAQ() {
    const container = document.getElementById('faqContainer');
    if (!faqData || !faqData.items) return;

    container.innerHTML = faqData.items.map((item, index) => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFAQ(this)">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down faq-icon"></i>
            </div>
            <div class="faq-answer">${item.answer.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

function toggleFAQ(element) {
    element.parentElement.classList.toggle('active');
}

function openFAQModal() {
    document.getElementById('faqModal').classList.add('active');
    loadFAQ();
}

function closeFAQModal() {
    document.getElementById('faqModal').classList.remove('active');
}

// ✅ Глобальные функции для HTML
window.faqAPI = {
    loadFAQ,
    renderFAQ,
    toggleFAQ,
    openFAQModal,
    closeFAQModal
};

// Закрытие по клику на фон
document.addEventListener('DOMContentLoaded', () => {
    const faqModal = document.getElementById('faqModal');
    if (faqModal) {
        faqModal.addEventListener('click', (e) => {
            if (e.target.id === 'faqModal') closeFAQModal();
        });
    }
});
