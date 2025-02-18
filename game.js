import { quizVoyage } from './questions.js'; // Import des questions

// Variables pour suivre l'état du quiz
let progressionQuiz = 0; // Commence à la première question
console.log(progressionQuiz)

// Sélection des éléments HTML
const contenuQuestion = document.querySelector('#question-text');
const contenuOptions = document.querySelector('#options-container');
const boutonSuivant = document.querySelector('#next-button');
const restartGame = document.querySelector('#replay-button');
let i = 0

// Fonction pour afficher une question basée sur l'index actuel
function loadQuestion() {
  // Vider le conteneur des options
  contenuOptions.innerHTML = '';

  // Récupérer la question actuelle
  const questionActuelle = quizVoyage.questions[i];
  console.log(questionActuelle);

  // Injecter la question dans le HTML
 contenuQuestion.innerText = questionActuelle.text;

  // Injecter les options dans le HTML
  questionActuelle.options.forEach(optionText => { 
    const newButton = document.createElement('button');
    newButton.innerText = optionText;
    console.log(newButton);
    newButton.classList.add('btn');
    contenuOptions.appendChild(newButton);
  });
}

// Ajouter un écouteur d'événements pour le bouton "Suivant"
boutonSuivant.addEventListener('click', () => {
  // Incrémenter l'index de la question
  i++;
  // Vérifier s'il reste des questions
  if (i < quizVoyage.questions.length) {
    // Afficher la question suivante
    loadQuestion();
  } else {
    // Si plus de questions, indiquer la fin du quiz
    contenuQuestion.innerText = 'test terminé';
    contenuOptions.innerHTML = ''; // Effacer les options
    boutonSuivant.style.display = 'none'; // Cacher le bouton Suivant
    restartGame.style.display = 'inline-block'; // Afficher le bouton restartGame
  }
});

// Charger la première question au chargement de la page
loadQuestion();

// Fonction pour réinitialiser le quiz
restartGame.addEventListener('click', () => {
    // TODO Réinitialiser l'index
    i = 0;
    // TODO Cacher le bouton Rejouer et afficher le bouton Suivant
    nextQuestion.style.display = 'inline-block';
    restartGame.style.display = 'none'; 
    // TODO Recharger la première question
    loadQuestion();
  });