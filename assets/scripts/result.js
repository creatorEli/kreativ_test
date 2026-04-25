var $ = (el) => document.querySelector(el);

const data = JSON.parse(localStorage.getItem('trainerResults')) || [];
if (data.length == 0) {
    alert("Ошибка, не удалось прочитать результаты!");
}


const tbody = $('.table-results tbody');
tbody.innerHTML = ""

const IMG_CROSS = 'assets/images/design/cross.svg';
const IMG_TICK = 'assets/images/design/tick.svg';

data.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td><img src="${item.img}" alt="${item.expectedAnswer}"></td>
        <td>${item.expectedAnswer}</td>
        <td>${item.userAnswer}</td>
        <td>
        <img src="${item.correct ? IMG_TICK : IMG_CROSS}" class="result-img" alt="${item.correct ? 'ВЕРНО' : 'НЕВЕРНО'}">
        </td>
      </tr>
    `;
});

function openTrainer() { // для возврата к тренажёру по нажатии крестика
    window.location.href = 'index.html';
}



const vowelRegex = /[аеёиоуыэюя]/gi;

function highlightVowels(node) { // функция для автоматического выделения гласных букв красным цветом
    // Работаем только с текстовыми узлами
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const matches = [...text.matchAll(vowelRegex)];

        if (matches.length > 0) {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            for (const match of matches) {
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                }
                const span = document.createElement('span');
                span.style.color = 'red';
                span.textContent = match[0];
                fragment.appendChild(span);
                lastIndex = match.index + match[0].length;
            }

            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            node.parentNode.replaceChild(fragment, node);
        }
    }
    // Рекурсивно обходим элементы, пропуская <script>, <style> и уже существующие <span>
    else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'SPAN'].includes(node.tagName)) {
        node.childNodes.forEach(highlightVowels);
    }
}

highlightVowels($('.table-results'));