const apiUrl = "https://ai-sermon-helper-worker.hsamusdae.workers.dev";
const questionListContainer = document.getElementById("question-list-container");
const form = document.getElementById("question-form");
const input = document.getElementById("question-input");

// 헬퍼 함수: 질문 아이템 DOM 생성
const createQuestionElement = (question) => {
    const item = document.createElement("div");
    item.classList.add("question-item");
    item.dataset.id = question.id;

    const text = document.createElement("span");
    text.classList.add("question-text");
    text.textContent = question.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "&#128465;"; // 휴지통 아이콘
    deleteBtn.setAttribute("aria-label", "Delete question");
    deleteBtn.onclick = () => deleteQuestion(question.id);

    item.appendChild(text);
    item.appendChild(deleteBtn);
    return item;
};

// 질문 목록 불러오기
const fetchQuestions = async () => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const questions = await response.json();

        questionListContainer.innerHTML = ""; // 기존 목록 초기화
        if (questions.length === 0) {
            questionListContainer.innerHTML = "<p>아직 등록된 질문이 없습니다.</p>";
        } else {
            questions.forEach(question => {
                const questionElement = createQuestionElement(question);
                questionListContainer.appendChild(questionElement);
            });
        }
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        questionListContainer.innerHTML = "<p>질문을 불러오는 데 실패했습니다.</p>";
    }
};

// 새 질문 추가
const addQuestion = async (text) => {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        // 성공적으로 추가 후, 목록 다시 로드
        await fetchQuestions();
    } catch (error) {
        console.error("Failed to add question:", error);
        alert("질문 추가에 실패했습니다.");
    }
};

// 질문 삭제
const deleteQuestion = async (id) => {
    if (!confirm("정말로 이 질문을 삭제하시겠습니까?")) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        // 화면에서 바로 제거
        const itemToRemove = document.querySelector(`.question-item[data-id='${id}']`);
        if (itemToRemove) {
            itemToRemove.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                itemToRemove.remove();
                 // 목록이 비었는지 확인
                if (questionListContainer.children.length === 0) {
                    questionListContainer.innerHTML = "<p>아직 등록된 질문이 없습니다.</p>";
                }
            }, 500);
        }

    } catch (error) {
        console.error("Failed to delete question:", error);
        alert("질문 삭제에 실패했습니다.");
    }
};

// 폼 제출 이벤트 리스너
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const questionText = input.value.trim();
    if (questionText) {
        await addQuestion(questionText);
        input.value = "";
        input.focus();
    }
});

// 초기 질문 목록 로드
fetchQuestions();

// CSS에 fadeOut 애니메이션 추가
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
`;
document.head.appendChild(styleSheet);