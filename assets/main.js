document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    loadContentFromJson();

    // Scroll progress bar animation
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / documentHeight) * 100;

        const progressBar = document.querySelector('.progress');
        progressBar.style.width = scrollProgress + '%';
    }

    // Update on scroll
    window.addEventListener('scroll', updateScrollProgress);

    // Initial update
    updateScrollProgress();

    // Expandable trait boxes
    document.querySelectorAll('.trait-box').forEach(box => {
        box.addEventListener('click', function() {
            if (this.classList.contains('expanded')) {
                // Closing: set explicit height first, then animate to 90px
                this.style.height = this.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    this.classList.remove('expanded');
                    this.style.height = '90px';
                });
            } else {
                // Opening: temporarily add expanded class to measure full height
                this.classList.add('expanded');
                const targetHeight = this.scrollHeight;
                this.classList.remove('expanded');

                // Set initial height and start animation
                this.style.height = '90px';
                requestAnimationFrame(() => {
                    this.classList.add('expanded');
                    this.style.height = targetHeight + 'px';
                });
            }
        });
    });

    function loadContentFromJson() {
        fetch('data/content.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch content.json');
                }
                return response.json();
            })
            .then(applyContent)
            .catch(error => {
                console.error('Error loading page content', error);
            });
    }

    function applyContent(content) {
        const welcomeEl = document.querySelector('.welcome h1');
        if (welcomeEl && content.welcome) {
            welcomeEl.textContent = content.welcome;
        }

        const summaryEl = document.querySelector('.summary p:not(.superpower-description)');
        if (summaryEl && content.summary) {
            summaryEl.textContent = content.summary;
        }

        if (content.animal) {
            const animalNameEl = document.querySelector('.animal-name h3');
            if (animalNameEl && content.animal.name) {
                animalNameEl.textContent = content.animal.name;
            }

            const animalDescriptionEl = document.querySelector('.animal-description p');
            if (animalDescriptionEl && content.animal.description) {
                animalDescriptionEl.textContent = content.animal.description;
            }
        }

        if (content.superpower) {
            const superpowerTitleEl = document.querySelector('.superpower-title');
            if (superpowerTitleEl && content.superpower.title) {
                superpowerTitleEl.innerHTML = content.superpower.title;
            }

            const superpowerDescriptionEl = document.querySelector('.superpower-description');
            if (superpowerDescriptionEl && content.superpower.description) {
                superpowerDescriptionEl.textContent = content.superpower.description;
            }
        }

        if (Array.isArray(content.sliders)) {
            const sliderBoxes = document.querySelectorAll('.slider-box');
            content.sliders.forEach((slider, index) => {
                const box = sliderBoxes[index];
                if (!box) {
                    return;
                }

                const titleEl = box.querySelector('.slider-box-title');
                if (titleEl && slider.title) {
                    titleEl.textContent = slider.title;
                }

                const contentEl = box.querySelector('.slider-box-content');
                if (contentEl && slider.content) {
                    contentEl.textContent = slider.content;
                }
            });
        }

        if (Array.isArray(content.traits)) {
            const traitBoxes = document.querySelectorAll('.trait-box');
            content.traits.forEach((trait, index) => {
                const box = traitBoxes[index];
                if (!box) {
                    return;
                }

                const titleEl = box.querySelector('.trait-title');
                if (titleEl && trait.title) {
                    titleEl.textContent = trait.title;
                }

                const levelEl = box.querySelector('.trait-level');
                if (levelEl && trait.level) {
                    levelEl.textContent = trait.level;
                }

                const descriptionEl = box.querySelector('.trait-description p');
                if (descriptionEl && trait.description) {
                    descriptionEl.textContent = trait.description;
                }
            });
        }
    }
});
