document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // 네비게이션 링크에 클릭 이벤트 리스너 추가
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // 기본 a 태그 동작(페이지 이동) 방지

            const targetSectionId = link.getAttribute('data-section');

            // 1. 모든 섹션을 숨기고 모든 링크의 활성 클래스를 제거합니다.
            sections.forEach(section => {
                section.style.display = 'none';
            });
            navLinks.forEach(navLink => {
                navLink.classList.remove('active-nav');
            });

            // 2. 목표 섹션만 보여주고 해당 링크에 활성 클래스를 추가합니다.
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            link.classList.add('active-nav');
        });
    });

    // 페이지 로드 시 기본적으로 '소개' 섹션을 보여줍니다.
    const introSection = document.getElementById('intro');
    if(introSection) {
        introSection.style.display = 'block';
    }

});
