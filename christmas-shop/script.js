//burger-menu functionality
const burger = document.getElementById('burger');
const menu = document.getElementById('menu-list');
const body = document.body;

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    body.classList.toggle('noscroll');
});

menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('menu-item')) {
        burger.classList.remove('open');
        menu.classList.remove('open');
        body.classList.remove('noscroll');
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        burger.classList.remove('open');
        menu.classList.remove('open');
        body.classList.remove('noscroll');
    }
});

//slider functionality
const sliderViewport = document.querySelector('.slider-viewport');
const sliderTrack = document.querySelector('.slider-row');
const btnLeft = document.querySelector('.arrow-left');
const btnRight = document.querySelector('.arrow-right');

if (sliderTrack && btnRight && btnLeft) {
    let currentStep = 0;

    function getTotalSteps() {
        return window.innerWidth < 768 ? 6 : 3;
    }

    function getStepWidth() {
        const totalSteps = getTotalSteps();
        const fullScrollWidth = sliderTrack.scrollWidth - sliderViewport.offsetWidth;

        return fullScrollWidth / totalSteps;
    }

    function updateSlider() {
        const stepWidth = getStepWidth();
        const totalSteps = getTotalSteps();

        sliderTrack.style.transform = `translateX(-${currentStep * stepWidth}px)`;

        btnLeft.disabled = currentStep === 0;
        btnRight.disabled = currentStep === totalSteps;

        btnLeft.style.opacity = btnLeft.disabled ? '0.5' : '1';
        btnRight.style.opacity = btnRight.disabled ? '0.5' : '1';
    }

    btnRight?.addEventListener('click', () => {
        const totalSteps = getTotalSteps();

        if (currentStep < totalSteps) {
            currentStep++;
            updateSlider();
        }
    });

    btnLeft?.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateSlider();
        }
    });

    window.addEventListener('resize', () => {
        currentStep = 0;
        updateSlider();
    });

    updateSlider();
}

//CTA functionality
const daysEl = document.getElementById('days');

if (daysEl) {
    let timerInterval;

    function updateCountdown() {
        const nextYear = new Date().getUTCFullYear() + 1;
        const targetDate = new Date(Date.UTC(nextYear, 0, 1));
        const now = Date.now();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timer-title').textContent = 'Happy New Year!!!';

            document.getElementById('days').textContent = 0;
            document.getElementById('hours').textContent = 0;
            document.getElementById('minutes').textContent = 0;
            document.getElementById('seconds').textContent = 0;

            return;
        }

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const days = Math.floor(diff / day);
        const hours = Math.floor((diff % day) / hour);
        const minutes = Math.floor((diff % hour) / minute);
        const seconds = Math.floor((diff % minute) / second);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    updateCountdown();

    timerInterval = setInterval(updateCountdown, 1000);
}

//best gifts functionality
const categoryMapping = {
    'For Work': 'work-caption',
    'For Health': 'health-caption',
    'For Harmony': 'harmony-caption',
};

// general function for creating a card
function createCardElement(gift) {
    const card = document.createElement('div');
    card.className = 'gift-card-item';

    const categoryClass = gift.category.toLowerCase().split(' ').pop();
    const imgPath = `assets/gift-${gift.category.toLowerCase().replace(/\s+/g, '-')}.png`;

    card.innerHTML = `
        <img src="${imgPath}" alt="${gift.name}">
        <div class="card-caption-container">
            <h3 class="${categoryClass}-caption h4-style">${gift.category}</h3>
            <h3 class="card-title">${gift.name}</h3>
        </div>
    `;

    return card;
}

async function renderBestGifts() {
    const container = document.querySelector('.best-gifts-cards-container');
    if (!container) return;

    try {
        const response = await fetch('gifts.json');
        const gifts = await response.json();

        const randomGifts = gifts.sort(() => Math.random() - 0.5).slice(0, 4);

        container.innerHTML = '';
        randomGifts.forEach((gift) => {
            const card = createCardElement(gift);
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

//gifts functionality for Gifts page
let allGifts = [];

async function initGiftsPage() {
    const container = document.querySelector('.gifts-cards-container');
    if (!container) return;

    try {
        const response = await fetch('gifts.json');
        allGifts = await response.json();

        renderGifts(allGifts);
        setupTabListeners();
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

function renderGifts(data) {
    const container = document.querySelector('.gifts-cards-container');
    if (!container) return;

    container.innerHTML = '';
    data.forEach((gift) => {
        container.appendChild(createCardElement(gift));
    });
}

function setupTabListeners() {
    const tabs = document.querySelectorAll('.gift-tag');

    if (tabs.length === 0) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            if (category === 'all') {
                renderGifts(allGifts);
            } else {
                const filtered = allGifts.filter((gift) => gift.category === category);
                renderGifts(filtered);
            }
        });
    });
}

renderBestGifts();
initGiftsPage();

//back-to-top functionality
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    const toggleBackToTopBtn = () => {
        const isMobile = window.innerWidth <= 768;
        const isScrolled = window.scrollY > 300;

        if (isMobile && isScrolled) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };

    window.addEventListener('scroll', toggleBackToTopBtn);
    window.addEventListener('resize', toggleBackToTopBtn);
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}

//modal-window functionality
async function initModalLogic() {
    const modal = document.querySelector('.modal-window-gifts');    
    const body = document.body;

    if (!modal) return;

    let giftsData = [];
    try {
        const response = await fetch('gifts.json');
        giftsData = await response.json();
    } catch (err) {
        console.error('Error loading data:', err);
    }

    function createSnowflakesHTML(value) {
        const activeCount = parseInt(value) / 100;
        let html = '';
        for (let i = 0; i < 5; i++) {
            const opacityValue = i < activeCount ? '1' : '0.1';
            html += `
                <div class="snowflake-container-img">
                    <img src="assets/snowflake.png" alt="Snowflake" style="opacity: ${opacityValue}">
                </div>`;
        }
        return html;
    }

    //open modal window
    function openModal(card) {
        if (giftsData.length === 0) return;

        const giftName = card.querySelector('.card-title').textContent.trim();
        const gift = giftsData.find(g => g.name === giftName);

        if (!gift) return;

        const categoryClass = gift.category.toLowerCase().split(' ').pop();
        const imgPath = `assets/gift-${gift.category.toLowerCase().replace(/\s+/g, '-')}.png`;

        modal.innerHTML = `
            <div class="modal-wrapper">
                <div class="modal-gift-card-item">
                    <div class="modal-image-container">
                        <img src="${imgPath}" alt="${giftName}"/>
                    </div>
                    
                    <div class="modal-description">
                        <div class="modal-caption-container">
                            <h3 class="h4-style ${categoryClass}-caption">${gift.category}</h3>
                            <h3 class="card-title">${giftName}</h3>
                            <p class="modal-description-text">${gift.description}</p>
                        </div>
                        
                        <div class="modal-superpower">
                            <h4 class="superpower-header">Adds superpowers to:</h4>
                            <div class="superpower-description">
                                ${Object.entries(gift.superpowers).map(([power, value]) => `
                                    <div class="${power}-container">
                                        <p class="power-name">${power.charAt(0).toUpperCase() + power.slice(1)}</p>
                                        <p class="power-value">${value}</p>
                                        <div class="power-snowflake">
                                            ${createSnowflakesHTML(value)}
                                        </div>
                                    </div>
                                    `).join('')}
                            </div>
                        </div>
                    </div>

                    <button class="close-modal-button">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 10L10 30" stroke="#181C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 10L30 30" stroke="#181C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        //close-button
        modal.querySelector('.close-modal-button').addEventListener('click', () => {
            modal.close();
            body.classList.remove('noscroll');
        });      

        modal.showModal();
        body.classList.add('noscroll');
    }
    
    //background-ckick
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
            body.classList.remove('noscroll');
        }
    });

    // delegate click event to gift cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.gift-card-item');
        if (card) {
            openModal(card);
        }
    });
}

initModalLogic();