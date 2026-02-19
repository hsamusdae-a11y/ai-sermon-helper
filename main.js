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

    // --- 설교 생성기 관련 로직 (작은 검색) ---
    const verseSearchBtn = document.getElementById('verseSearchBtn');
    const verseSearchInput = document.getElementById('verseSearchInput');
    const verseSearchResult = document.getElementById('verseSearchResult');
    const verseResultText = document.getElementById('verseResultText');
    const addVerseBtn = document.getElementById('addVerseBtn');
    const sermonVerseText = document.getElementById('sermonVerseText');

    // 공통 검색 함수
    async function fetchVerse(query) {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=ko-ge`);
        if (!response.ok) {
            throw new Error('해당 구절을 찾을 수 없거나 네트워크에 문제가 발생했습니다.');
        }
        const data = await response.json();
        return `${data.reference}\n${data.text}`.trim();
    }

    if(verseSearchBtn) {
        verseSearchBtn.addEventListener('click', async () => {
            const query = verseSearchInput.value.trim();
            if (!query) {
                alert('검색할 성경 구절을 입력하세요.');
                return;
            }
    
            verseResultText.textContent = '검색 중...';
            verseSearchResult.style.display = 'block';
    
            try {
                const result = await fetchVerse(query);
                verseResultText.textContent = result;
                addVerseBtn.style.display = 'inline-block';
            } catch (error) {
                console.error("Bible API Error:", error);
                verseResultText.textContent = `오류: ${error.message}`;
                addVerseBtn.style.display = 'none';
            }
        });
    }

    if(addVerseBtn) {
        addVerseBtn.addEventListener('click', () => {
            const currentText = sermonVerseText.value;
            const verseToAdd = verseResultText.textContent;
    
            if (currentText.trim().length > 0) {
                sermonVerseText.value = `${currentText}\n\n${verseToAdd}`;
            } else {
                sermonVerseText.value = verseToAdd;
            }
        });
    }

    // --- 성구검색 탭 관련 로직 (메인 검색) ---
    const mainVerseSearchBtn = document.getElementById('mainVerseSearchBtn');
    const mainVerseSearchInput = document.getElementById('mainVerseSearchInput');
    const mainVerseSearchResult = document.getElementById('mainVerseSearchResult');

    if(mainVerseSearchBtn) {
        mainVerseSearchBtn.addEventListener('click', async () => {
            const query = mainVerseSearchInput.value.trim();
            if (!query) {
                alert('검색할 성경 구절을 입력하세요. (예: 창세기 1:1)');
                return;
            }
    
            mainVerseSearchResult.innerHTML = '<p>검색 중...</p>';
    
            try {
                const result = await fetchVerse(query);
                // 결과를 pre 태그로 감싸서 줄바꿈을 유지하도록 합니다.
                mainVerseSearchResult.innerHTML = `<pre>${result}</pre>`;
            } catch (error) {
                console.error("Bible API Error:", error);
                mainVerseSearchResult.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
            }
        });
    }


    // --- 페이지 로드 시 초기 상태 설정 ---
    const introSection = document.getElementById('intro');
    if (introSection) {
        introSection.style.display = 'block';
    }
});
