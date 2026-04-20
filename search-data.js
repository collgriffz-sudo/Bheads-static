// Наша единая база товаров для всего сайта
const productsData = [
    {
        name: "Фигурка 1 человека + питомец по фото, из глины (Ручная работа)",
        url: "/goods/Figurka-iz-gliny-dlya-1-cheloveka-2.html",
        img: "https://bheads7.ru/3/1754/217531194/075a3e/figurka-1-cheloveka-pitomec-po-foto-iz-gliny-ruchnaya-rabota.jpg",
        price: "14490 руб."
    },
    {
        name: "Фигурки 2 человек по фото, из глины (Ручная работа)",
        url: "/goods/Figurka-iz-gliny-dlya-2-cheloveka.html",
        img: "https://bheads7.ru/3/1754/217531191/075a3e/figurki-2-chelovek-po-foto-iz-gliny-ruchnaya-rabota.jpg",
        price: "17190 руб."
    },
    {
        name: "Фигурка домашнего питомца из глины, по фото (Ручная работа)",
        url: "/goods/Figurka-iz-gliny-dlya-pitomtsa.html",
        img: "https://bheads7.ru/3/1754/217531188/075a3e/figurka-domashnego-pitomca-iz-gliny-po-foto-ruchnaya-rabota.jpg",
        price: "7190 руб."
    },
    {
        name: "Фигурка человека по фото, из глины (Ручная работа)",
        url: "/goods/Figurka-iz-gliny-dlya-1-cheloveka.html",
        img: "https://bheads7.ru/3/1754/217531185/075a3e/figurka-cheloveka-po-foto-iz-gliny-ruchnaya-rabota.jpg",
        price: "9490 руб."
    }
];

// Логика поиска
function liveSearch() {
    let input = document.getElementById('mySearchInput');
    if(!input) return;
    
    let filter = input.value.toLowerCase();
    let resultBlock = document.getElementById('search__result');
    let list = document.getElementById('searchResultsList');
    
    if (filter.length < 2) {
        resultBlock.style.display = 'none';
        return;
    }

    let html = '';
    let found = productsData.filter(item => item.name.toLowerCase().includes(filter));

    if (found.length > 0) {
        found.forEach(item => {
            html += `
                <a href="${item.url}" class="result__item" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; text-decoration: none; color: #000;">
                    <img src="${item.img}" style="width: 50px; height: 50px; margin-right: 15px; object-fit: cover;">
                    <div>
                        <div style="font-size: 14px; font-weight: bold;">${item.name}</div>
                        <div style="color: #d84315;">${item.price}</div>
                    </div>
                </a>
            `;
        });
        resultBlock.style.display = 'block';
        list.innerHTML = html;
    } else {
        list.innerHTML = '<div style="padding: 10px;">Ничего не найдено</div>';
        resultBlock.style.display = 'block';
    }
}

function resetSearch() {
    document.getElementById('mySearchInput').value = '';
    document.getElementById('search__result').style.display = 'none';
}

// Закрытие при клике вне поиска
document.addEventListener('click', function(e) {
    let resBlock = document.getElementById('search__result');
    if (resBlock && !e.target.closest('.search')) {
        resBlock.style.display = 'none';
    }
});
