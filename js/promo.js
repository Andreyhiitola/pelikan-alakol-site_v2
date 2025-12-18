// js/promo.js — управление плавающей кнопкой АКЦИИ
// 
// ИНСТРУКЦИЯ:
// 1. Чтобы ПОКАЗАТЬ кнопку: установи SHOW_PROMO_BUTTON = true
// 2. Чтобы СКРЫТЬ кнопку: установи SHOW_PROMO_BUTTON = false
// 3. Позиция кнопки настраивается в строке btn.style.cssText:
//    - top: 80px (расстояние от верха)
//    - right: 20px (расстояние от правого края)
//    Можно менять на left/bottom для других углов
// 4. Цвет кнопки: background:#ff4444 (красный), меняй на свой
// 5. Текст кнопки: '🔥 АКЦИИ!!!' — меняй на своё

const SHOW_PROMO_BUTTON = true; // ← ГЛАВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ: true/false

if (SHOW_PROMO_BUTTON) {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.createElement('a');
        btn.href = '#offers'; // ← Ссылка на раздел акций
        btn.innerHTML = '🔥 АКЦИИ!!!'; // ← Текст кнопки
        btn.style.cssText = `
            position:fixed; 
            top:80px; 
            right:20px; 
            background:#ff4444; 
            color:white; 
            padding:15px 25px; 
            border-radius:50px; 
            font-size:18px; 
            font-weight:bold; 
            text-decoration:none; 
            box-shadow:0 4px 15px rgba(255,68,68,0.4); 
            z-index:9999; 
            animation:pulse 1.5s infinite;
        `;
        
        document.body.appendChild(btn);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    });
}
