import { initializeApp } from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js';

// IMPORTANT: Replace with your Firebase project's configuration
const firebaseConfig = {
  "projectId": "product-builder-code",
  "appId": "1:574340521439:web:e43248dfcd12480e4f386a",
  "storageBucket": "product-builder-code.appspot.com",
  "apiKey": "AIzaSyCYX3OOhXG20kULitY1APHz2OPidI_lA2I",
  "authDomain": "product-builder-code.firebaseapp.com",
  "messagingSenderId": "574340521439"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- <simple-greeting> Web Component ---
class SimpleGreeting extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'greeting-wrapper');
    const text = document.createElement('p');
    text.textContent = `Hello, ${this.getAttribute('name') || 'World'}! Ask a question below.`;
    
    const style = document.createElement('style');
    style.textContent = `
      .greeting-wrapper p {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        text-align: center;
      }
    `;
    
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(text);
  }
}
customElements.define('simple-greeting', SimpleGreeting);

// --- <question-form> Web Component ---
class QuestionForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        input {
          flex-grow: 1;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }
        button {
          padding: 12px 20px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
      <form>
        <input type="text" placeholder="Type your question..." required />
        <button type="submit">Ask</button>
      </form>
    `;

    this.form = this.shadowRoot.querySelector('form');
    this.input = this.shadowRoot.querySelector('input');
  }

  connectedCallback() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const questionText = this.input.value.trim();
      if (questionText) {
        try {
          await addDoc(collection(db, 'questions'), {
            text: questionText,
            timestamp: serverTimestamp(),
          });
          this.input.value = '';
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    });
  }
}
customElements.define('question-form', QuestionForm);

// --- <question-list> Web Component ---
class QuestionList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        h2 {
            text-align: center;
            color: #444;
        }
        .question-list-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .question-item {
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 8px;
        }
      </style>
      <h2>Questions</h2>
      <div class="question-list-container"></div>
    `;
    this.container = this.shadowRoot.querySelector('.question-list-container');
  }

  connectedCallback() {
    const q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
      this.renderQuestions(snapshot.docs);
    });
  }

  renderQuestions(docs) {
    this.container.innerHTML = '';
    docs.forEach(doc => {
      const item = document.createElement('div');
      item.className = 'question-item';
      item.textContent = doc.data().text;
      this.container.appendChild(item);
    });
  }
}
customElements.define('question-list', QuestionList);
