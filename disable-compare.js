// Отключаем все функции сравнения
window.removeFromCompareAll = function() { return false; };
window.removeFromCompare = function() { return false; };
window.addToCompare = function() { return false; };
window.showCompareMessage = function() { return false; };

// Отключаем всплывающие уведомления
if (typeof Noty !== 'undefined') {
    Noty.prototype.show = function() { return this; };
}

// Убираем все обработчики кликов с ссылок, которые могут вызывать сравнение
document.addEventListener('DOMContentLoaded', function() {
    var compareLinks = document.querySelectorAll('[data-action-add-url*="compare"], .add-compare, [onclick*="compare"]');
    compareLinks.forEach(function(link) {
        link.removeAttribute('onclick');
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.5';
    });
});