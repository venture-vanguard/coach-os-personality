document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

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
});
