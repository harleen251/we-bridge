document.addEventListener('DOMContentLoaded', function () {
  const circle1 = document.getElementById('circle1');
  const circle2 = document.getElementById('circle2');

  window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const stopPosition = windowHeight / 2;

    const circle1OffsetY = Math.min(scrollPosition * 0.4, stopPosition);
    const circle2OffsetY = Math.max(-scrollPosition * 0.4, -stopPosition);

    circle1.style.transform = `translateY(${circle1OffsetY}px)`;
    circle2.style.transform = `translateY(${circle2OffsetY}px)`;

    if (Math.abs(circle1OffsetY - circle2OffsetY) <= circle1.offsetHeight) {
      circle1.classList.add('active');
      circle2.classList.add('active');
    }
  });
});
