$(function() {
    const lazyItemOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const lazyItemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyItem = entry.target;
                lazyItemObserver.unobserve(lazyItem);
                loadLazyItem(lazyItem);
            }
        });
    }, lazyItemOptions);

    const lazyList = document.querySelectorAll('.lazy-item');

    lazyList.forEach(lazyItem => {
        lazyItemObserver.observe(lazyItem);
    });

    setTimeout(function() {
        lazyList.forEach(lazyItem => {
            if (lazyItem.getAttribute('data-is-loaded') === '1') return;

            lazyItemObserver.unobserve(lazyItem);
            loadLazyItem(lazyItem);
        });
    }, 3000);


    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                const src = lazyImage.getAttribute('data-src');

                lazyImage.setAttribute('src', src);

                lazyItemObserver.unobserve(lazyImage);
            }
        });
    }, lazyItemOptions);

    const lazyImageList = document.querySelectorAll('.lazy-image');

    lazyImageList.forEach(lazyImage => {
        lazyImageObserver.observe(lazyImage);
    });
});

function loadLazyItem(lazyItem) {
    lazyItem.setAttribute('data-is-loaded', '1');

    const filter = JSON.parse(lazyItem.getAttribute('data-filter'));
    const elementId = lazyItem.getAttribute('data-element-id');
    const src = lazyItem.getAttribute('data-src');
    const currentPage = lazyItem.getAttribute('data-current-page');
    const colorName = lazyItem.getAttribute('data-color-name');
    let sliderId;

    $.get(src, {filter, elementId, currentPage, colorName}, response => {
        lazyItem.innerHTML = response;
        sliderId = $(response).find('.crkr-slider').attr('id');
    }).done(function() {
        initSlider(sliderId);
        fixProductGrid();
    });
}