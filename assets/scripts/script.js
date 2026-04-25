var $ = (el) => document.querySelector(el); // синтаксический сахар для удобства

class TrainingCard { // класс одного элемента тренажёра
    constructor(id, elImg, cardAnswer) {
        this.id = id
        this.cardImg = elImg;
        this.cardAnswer = cardAnswer;
        this.userAnswer = "";
        this.cardResult = null;
    };

    checkAnswer(userInput) {
        this.userResult = userInput
        // Приводим к верхнему регистру и убираем пробелы
        const normalizedInput = userInput.trim().toUpperCase();
        this.cardResult = normalizedInput == this.cardAnswer;
        return this.result;
    };

    render() {
        return `
        <div class="form-trainer">
            <div class="trainer-image">
                <img src="${this.cardImg}" id="trainerImage" alt="Тюмень">
            </div>
            <div class="trainer-form">
                <label class="trainer-text">Напечатай <span id="labelWord">${this.cardAnswer}</span></label>
                <div class="input-button-field">
                    <input type="text" class="text-field" />
                    <button type="button" class="check-button">
                        <img src="assets/images/design/tick_invalid.svg" alt="Проверить">
                    </button>
                </div>
            </div>
        </div>
        `
    };
};


var trainingCards = [
    new TrainingCard(1, "assets/images/green.svg", "ЗЕЛЕНЬ"),
    new TrainingCard(2, "assets/images/ashan.svg", "АШАН"),
    new TrainingCard(3, "assets/images/tyumen.svg", "ТЮМЕНЬ"),
    new TrainingCard(4, "assets/images/roller.svg", "КАТОК"),
    new TrainingCard(5, "assets/images/ice_rink.svg", "КАТОК")
];

function shuffle(array) {// функция перемешивания порядка каточек
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(trainingCards)


// Состояние тренажёра до начала 
let currentCardIndex = 0;
let results = []; // Массив для хранения ответов

// DOM-элементы
const whiteField = $('.white-body-field');
const navButtons = document.querySelectorAll('.navigation-menu button');

// Обновление стилей навигации
function updateNav() {
    navButtons.forEach((btn, idx) => {
        btn.classList.remove('active-nav-btn', 'completed-nav-btn');
        if (idx < currentCardIndex) {
            btn.classList.add('completed-nav-btn');
        } else if (idx === currentCardIndex) {
            btn.classList.add('active-nav-btn');
        }
    });
}

// Привязка событий к новому вопросу
function attachListeners() {
    const input = $('.text-field');
    const checkBtn = $('.check-button');
    const checkImg = checkBtn.querySelector('img');

    const IMG_DISABLED = 'assets/images/design/tick_invalid.svg';
    const IMG_ENABLED = 'assets/images/design/tick.svg';

    // Начальное состояние
    checkImg.src = IMG_DISABLED;

    // Отслеживание ввода
    input.addEventListener('input', () => {
        const hasText = input.value.trim().length > 0;
        checkImg.src = hasText ? IMG_ENABLED : IMG_DISABLED;
    });

    // Клик по кнопке "Проверить"
    checkBtn.addEventListener('click', () => {
        const val = input.value.toUpperCase();
        if (!val.trim()) return; // Блокируем проверку пустого поля
        trainingCards[currentCardIndex].checkAnswer(val);

        let res = {
            id: currentCardIndex + 1,
            img: trainingCards[currentCardIndex].cardImg,
            expectedAnswer: trainingCards[currentCardIndex].cardAnswer,
            userAnswer: val,
            correct: trainingCards[currentCardIndex].cardResult
        }

        results.push(res);

        // Переходим к следующему вопросу
        currentCardIndex++;
        renderCard();
    });
}

function renderCard() {
    if (currentCardIndex >= trainingCards.length) {
        whiteField.innerHTML = `
            <div class="results-block">
                <h1>Тренажёр завершён!</h1>
                <a href="results.html"> Посмотреть результаты </a>
                <button onclick="resetTrainer()">Пройти заново</button>
            </div>
        `

        localStorage.setItem('trainerResults', JSON.stringify(results));

        // Все кнопки становятся "пройденными"
        navButtons.forEach(btn => {
            btn.classList.remove('active-nav-btn');
            btn.classList.add('completed-nav-btn');
        });
        return
    }

    whiteField.innerHTML = trainingCards[currentCardIndex].render();
    updateNav();
    attachListeners();
}

renderCard();

function resetTrainer() {
    shuffle(trainingCards)
    currentCardIndex = 0;
    results = [];
    renderCard();
}