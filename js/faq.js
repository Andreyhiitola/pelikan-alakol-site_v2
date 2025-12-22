// js/faq.js - 100% РАБОЧИЙ FAQ с INLINE стилями (ИСПРАВЛЕНО!)
let faqData = null;

async function loadFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка вопросов...</div>';
        const response = await fetch('./faq.json');
        faqData = await response.json();
        console.log('✅ FAQ загружен:', faqData.items.length, 'вопросов');
        renderFAQ();
    } catch (error) {
        console.error('❌ FAQ:', error);
    }
}

function renderFAQ() {
    const container = document.getElementById('faqContainer');
    if (!faqData?.items) return;

    container.innerHTML = faqData.items.map(item => `
        <div class="faq-item" style="background:white;border-radius:8px;margin-bottom:10px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.3s;">
            <div class="faq-question" style="padding:15px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-weight:600;color:#2c3e50;background:#f8f9fa;">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down faq-icon" style="transition:transform 0.3s;color:#3498db;"></i>
            </div>
            <div class="faq-answer" style="max-height:0;overflow:hidden;padding:0 20px;color:#555;line-height:1.6;transition:all 0.3s;background:white;">${item.answer.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

function openFAQModal() {
    document.getElementById('faqModal').classList.add('active');
    if (!faqData) loadFAQ();
}

function closeFAQModal() {
    document.getElementById('faqModal').classList.remove('active');
}

// ✅ ИСПРАВЛЕННАЯ ЛОГИКА: ЗАКРЫВАЕМ ВСЕ → ОТКРЫВАЕМ 1
document.addEventListener('click', function(e) {
    const question = e.target.closest('.faq-question');
    if (question) {
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        const isActive = answer.style.maxHeight !== '0px';
        
        // ✅ 1. ЗАКРЫВАЕМ ВСЕ АККОРДЕОНЫ
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const faqIcon = faqItem.querySelector('.faq-icon');
            const faqQuestion = faqItem.querySelector('.faq-question');
            
            faqAnswer.style.maxHeight = '0px';
            faqAnswer.style.padding = '0 20px';
            faqIcon.style.transform = 'rotate(0deg)';
            faqQuestion.style.background = '#f8f9fa';
            faqQuestion.style.color = '#2c3e50';
            faqItem.classList.remove('active');
        });
        
        // ✅ 2. ОТКРЫВАЕМ ТОЛЬКО НАЖАТЫЙ
        if (!isActive) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.padding = '15px 20px';
            icon.style.transform = 'rotate(180deg)';
            question.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
            question.style.color = 'white';
            item.classList.add('active');
        }
        
        console.log('✅ FAQ toggled:', !isActive);
    }
});

window.faqAPI = { openFAQModal, closeFAQModal };
