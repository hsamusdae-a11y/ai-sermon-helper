document.addEventListener('DOMContentLoaded', () => {

    // --- 기본 네비게이션 로직 ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSectionId = link.getAttribute('data-section');

            sections.forEach(section => { section.style.display = 'none'; });
            navLinks.forEach(navLink => { navLink.classList.remove('active-nav'); });

            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            link.classList.add('active-nav');
        });
    });

    // --- 설교 생성기 관련 로직 ---
    const verseSearchBtn = document.getElementById('verseSearchBtn');
    const verseSearchInput = document.getElementById('verseSearchInput');
    const verseSearchResult = document.getElementById('verseSearchResult');
    const verseResultText = document.getElementById('verseResultText');
    const addVerseBtn = document.getElementById('addVerseBtn');
    const sermonVerseText = document.getElementById('sermonVerseText');

    // 성경 구절 검색 버튼 클릭 이벤트
    verseSearchBtn.addEventListener('click', async () => {
        const query = verseSearchInput.value.trim();
        if (!query) {
            alert('검색할 성경 구절을 입력하세요. (예: 요한복음 3:16)');
            return;
        }

        verseResultText.textContent = '검색 중...';
        verseSearchResult.style.display = 'block';

        try {
            // bible-api.com API 호출
            const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=ko-ge`);
            
            if (!response.ok) {
                throw new Error('해당 구절을 찾을 수 없거나 네트워크에 문제가 발생했습니다.');
            }

            const data = await response.json();

            // 성공적으로 데이터를 받으면 결과 텍스트를 채웁니다.
            verseResultText.textContent = `${data.reference}\n${data.text}`.trim();
            addVerseBtn.style.display = 'inline-block'; // 추가 버튼 표시

        } catch (error) {
            console.error("Bible API Error:", error);
            verseResultText.textContent = `오류: ${error.message}`;
            addVerseBtn.style.display = 'none'; // 에러 시 추가 버튼 숨김
        }
    });

    // 본문에 추가 버튼 클릭 이벤트
    addVerseBtn.addEventListener('click', () => {
        const currentText = sermonVerseText.value;
        const verseToAdd = verseResultText.textContent;

        // 이미 텍스트가 있으면 줄바꿈 후 추가, 없으면 그냥 추가
        if (currentText.trim().length > 0) {
            sermonVerseText.value = `${currentText}\n\n${verseToAdd}`;
        } else {
            sermonVerseText.value = verseToAdd;
        }
    });


    // --- 페이지 로드 시 초기 상태 설정 ---
    document.getElementById('intro').style.display = 'block';
});
