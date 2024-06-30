import "./style.css";
import { Questions } from "./question";
const TIMEAOUT = 4000;
console.log(Questions);

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");
// const colors = ["crimson", "gold"];
// setInterval(() => {
//   app.style.background = colors[i];
//   i++;
//   if (i > colors.length - 1) {
//     i = 0;
//   }
// }, 1000);

// let i = 0;
// startButton.addEventListener("click", () => {
//   const question =
//     document.querySelector("#question") ?? document.createElement("p");
//   question.id = "question";
//   app.appendChild(question);
//   question.innerText = Questions[i].question;
//   app.insertBefore(question, startButton);

//   i++;
//   if (i > Questions.length - 1) {
//     i = 0;
//     question.remove();
//     console.log("Question remove");
//   }
// });

// console.log({
//   parent: app.parentElement,
//   prevSister: app.previousElementSibling,
//   nextSister: app.nextElementSibling,
//   firstChild: app.firstElementChild,
//   lastChild: app.lastElementChild,
//   children: app.children,
// });
// app.innerHTML = " <div div> salut</div>";

startButton.addEventListener("click", startQuiz);
function startQuiz(event) {
  event.stopPropagation();
  let currentQuestion = 0;
  let score = 0;

  clean();
  displayQuestion(currentQuestion);

  function clean() {
    //params <=au cas ou

    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];
    if (!question) {
      displayFinichMessage();
      return;
    }
    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    // submitButton.removeEventListener;

    app.appendChild(submitButton);
  }

  function displayFinichMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! tu as terminé le quiz.";
    const p = document.createElement("p");
    p.innerText = `tu as eu ${score} sur ${Questions.length} point !`;
    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');

    disableAllAnswers();

    const value = selectedAnswer.value;

    const question = Questions[currentQuestion];

    const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    displayNexQuestionButton(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    });

    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);
  }

  function createAnswers(answers) {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }
    return answersDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);

  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for ="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(answer);
  const selectedElement = document.querySelector(
    `label[for ="${selectedAnswerId}"]`
  );

  //   if (isCorrect) {
  // }
  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
  //   } else {
  //   selectedElement.classList.add("incorrect");
  // correctElement.classList.add("correct");
  // }
}

function getFeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");

  paragraph.innerText = isCorrect
    ? ` Bravo ! Tu as eu la bonne reponse`
    : `Desolé... mais la bonne réponse etait ${correct}`;

  return paragraph;
}

function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  return progress;
}

function displayNexQuestionButton(callback) {
  let remainingTimeout = TIMEAOUT;

  app.querySelector("button").remove();

  const getButtontext = () => `Next (${remainingTimeout / 1000}s)`;

  const nextButton = document.createElement("button");
  nextButton.innerText = getButtontext();
  app.appendChild(nextButton);

  const interval = setInterval(() => {
    remainingTimeout -= 1000;
    nextButton.innerText = getButtontext();
  }, 1000);

  const timeout = setTimeout(() => {
    handeleNextQuestion();
  }, TIMEAOUT);

  const handeleNextQuestion = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    callback();
  };

  nextButton.addEventListener(" click", () => {
    handeleNextQuestion();
  });
}
function disableAllAnswers() {
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  for (const radio of radioInputs) {
    radio.disabled = true;
  }
}
