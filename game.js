import { quizVoyage } from './questions.js'; // Import des questions
let i = 0;
let score = 0;
let numberProgress = 1;
const totalQuestions = quizVoyage.questions.length; // Nombre total de questions

// Sélection des éléments HTML
const contenuQuestion = document.querySelector('#question-text');
const contenuOptions = document.querySelector('#options-container');
const boutonSuivant = document.querySelector('#next-button');
const restartGame = document.querySelector('#replay-button');
const progressBarre = document.querySelector('#barre');
const numberProgressElement = document.querySelector('#number');

// Fonction pour afficher une question basée sur l'index actuel
function loadQuestion() {
  contenuOptions.innerHTML = '';
  const questionActuelle = quizVoyage.questions[i];
  contenuQuestion.innerText = questionActuelle.text;
  
  // Injecter les options dans le HTML
  questionActuelle.options.forEach(optionText => {
    const newButton = document.createElement('button');
    newButton.innerText = optionText;
    newButton.classList.add('btn');
    contenuOptions.appendChild(newButton);
  });

  // Affichage dynamique de la progression : X / totalQuestions
  numberProgressElement.textContent = `${numberProgress} / ${totalQuestions}`;
  CheckAnswer();
}

// Ajouter un écouteur d'événements pour le bouton "Suivant"
boutonSuivant.addEventListener('click', () => {
  // Mise à jour de la barre de progression
  if (progressBarre) {
    if (numberProgress < totalQuestions) { 
        progressBarre.value = Math.min(progressBarre.value + 10, progressBarre.max);
        numberProgress += 1;
    }
    numberProgressElement.textContent = `${Math.min(numberProgress, totalQuestions)} / ${totalQuestions}`;
  }

  i++; // Passer à la question suivante

  if (i < quizVoyage.questions.length) {
    loadQuestion(); // Afficher la prochaine question
  } else {
    // Fin du quiz
    contenuQuestion.innerText = 'All done !';
    contenuOptions.innerHTML = `Tu as obtenu ${score} sur ${totalQuestions}`;
    boutonSuivant.style.display = 'none';
    restartGame.style.display = 'inline-block';
  }
});

// Charger la première question au démarrage
loadQuestion();

// Fonction pour réinitialiser le quiz
restartGame.addEventListener('click', () => {
  i = 0;
  score = 0;
  progressBarre.value = 0;
  numberProgress = 1;
  numberProgressElement.textContent = `${numberProgress} / ${totalQuestions}`;
  boutonSuivant.style.display = 'inline-block';
  restartGame.style.display = 'none';
  
  loadQuestion(); // Recharger la première question
});

// Fonction pour vérifier la réponse
function CheckAnswer() {
  const buttons = document.querySelectorAll('.btn');
  boutonSuivant.setAttribute('disabled', ''); // Désactiver le bouton suivant jusqu'à ce que l'utilisateur ait répondu

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const questionActuelle = quizVoyage.questions[i];
      const correctAnswer = questionActuelle.correct_answer;
      buttons.forEach(btn => btn.setAttribute('disabled', '')); // Désactiver tous les boutons après réponse
      boutonSuivant.removeAttribute('disabled'); // Réactiver le bouton "Suivant"

      if (button.textContent === correctAnswer) {
        button.style.backgroundColor = "#008000"; // Bonne réponse en vert
        score++;
      } else {
        button.style.backgroundColor = "#FF0000"; // Mauvaise réponse en rouge
      }
      buttons.forEach(btn => {
        if(btn.textContent === correctAnswer){
          btn.style.backgroundColor = '#008000'
        }
      })
      console.log("score", score, "sur", quizVoyage.questions.length);
      console.log("Réponse choisie :", button.textContent);
      console.log("Bonne réponse :", questionActuelle.correct_answer);
    });
  });
}

console.log(score, "sur", quizVoyage.questions.length);