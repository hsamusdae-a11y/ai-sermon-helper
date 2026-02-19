document.addEventListener('DOMContentLoaded', () => {

    // --- *** [수정됨] *** 기본 네비게이션 로직 ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const mainNavList = document.getElementById('main-nav-list');

    // 초기 상태: intro 섹션만 표시
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('intro').style.display = 'block';

    // 네비게이션 클릭 이벤트 처리 (이벤트 위임 사용)
    mainNavList.addEventListener('click', (event) => {
        const link = event.target.closest('.nav-link');
        if (!link) return; // nav-link가 아니면 무시

        event.preventDefault();
        
        // 모든 링크에서 active 클래스 제거
        navLinks.forEach(navLink => {
            navLink.classList.remove('active-nav');
        });

        // 클릭된 링크에 active 클래스 추가
        link.classList.add('active-nav');

        // 모든 섹션 숨기기
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // 대상 섹션 표시
        const targetSectionId = link.getAttribute('data-section');
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    });

    // --- 공통 성경 검색 함수 ---
    async function fetchVerse(query) {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=ko-ge`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || '해당 구절을 찾을 수 없거나 네트워크에 문제가 있습니다.';
            throw new Error(errorMessage);
        }
        const data = await response.json();
        return `${data.reference}\n${data.text}`.trim();
    }

    // --- *** [수정됨] *** 설교 생성기 관련 로직 ---
    const sermonGeneratorSection = document.getElementById('sermon-generator');
    if (sermonGeneratorSection) {
        const verseSearchBtn = sermonGeneratorSection.querySelector('#verseSearchBtn');
        const verseSearchInput = sermonGeneratorSection.querySelector('#verseSearchInput');
        const verseSearchResult = sermonGeneratorSection.querySelector('#verseSearchResult');
        const verseResultText = sermonGeneratorSection.querySelector('#verseResultText');
        const addVerseBtn = sermonGeneratorSection.querySelector('#addVerseBtn');
        const sermonVerseText = sermonGeneratorSection.querySelector('#sermonVerseText');

        if (verseSearchBtn) {
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
                    if(addVerseBtn) addVerseBtn.style.display = 'inline-block';
                } catch (error) {
                    console.error("Sermon Gen Bible API Error:", error);
                    verseResultText.textContent = `오류: ${error.message}`;
                    if(addVerseBtn) addVerseBtn.style.display = 'none';
                }
            });
        }

        if (addVerseBtn) {
            addVerseBtn.addEventListener('click', () => {
                if (!sermonVerseText || !verseResultText) return;
                const currentText = sermonVerseText.value;
                const verseToAdd = verseResultText.textContent;
        
                if (currentText.trim().length > 0) {
                    sermonVerseText.value = `${currentText}\n\n${verseToAdd}`;
                } else {
                    sermonVerseText.value = verseToAdd;
                }
            });
        }
    }

    // --- 성구검색 탭 관련 로직 ---
    const verseSearchSection = document.getElementById('verse-search');
    if(verseSearchSection) {
        const mainVerseSearchBtn = verseSearchSection.querySelector('#mainVerseSearchBtn');
        const mainVerseSearchInput = verseSearchSection.querySelector('#mainVerseSearchInput');
        const mainVerseSearchResult = verseSearchSection.querySelector('#mainVerseSearchResult');

        if (mainVerseSearchBtn) {
            mainVerseSearchBtn.addEventListener('click', async () => {
                const query = mainVerseSearchInput.value.trim();
                if (!query) {
                    alert('검색할 성경 구절을 입력하세요. (예: 창세기 1:1)');
                    return;
                }
        
                mainVerseSearchResult.innerHTML = '<p>검색 중...</p>';
        
                try {
                    const result = await fetchVerse(query);
                    mainVerseSearchResult.innerHTML = `<pre>${result}</pre>`;
                } catch (error) {
                    console.error("Main Bible API Error:", error);
                    mainVerseSearchResult.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
                }
            });
        }
    }
});
