import { quizVoyage } from './questions.js'; // Import des questions

// Variables pour suivre l'état du quiz
let i = 0;
let score = 0
// Sélection des éléments HTML
const contenuQuestion = document.querySelector('#question-text');
const contenuOptions = document.querySelector('#options-container');
const contenuFinal = document.querySelector('#message-final')
const boutonSuivant = document.querySelector('#next-button');
const restartGame = document.querySelector('#replay-button');
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
  CheckAnswer();
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
    contenuQuestion.innerText = '';
    contenuOptions.innerHTML = '';
    contenuFinal.innerHTML = `All done ! 
    Tu as obtenu ${score} sur ${quizVoyage.questions.length} 
    ${commentaireScore()}`
    boutonSuivant.style.display = 'none'; // Cacher le bouton Suivant
    restartGame.style.display = 'inline-block'; // Afficher le bouton restartGame
  }
});
// Charger la première question au chargement de la page
loadQuestion();
// Fonction pour réinitialiser le quiz
restartGame.addEventListener('click', () => {
    // Réinitialiser l'index et score
    i = 0;
    score = 0
    // Cacher le bouton Rejouer et afficher le bouton Suivant
    contenuFinal.innerHTML = '';
    boutonSuivant.style.display = 'inline-block';
    restartGame.style.display = 'none';
  
    loadQuestion();   // Recharger la première question
  });

  //Fonction Check Answer
  // function envoi réponse
  // click
  // retour de la réponse donnée questions.options
    // console.log(retour réponse)
  // si cette réponse = questions.correct_answer
    // console.log(questions.correct_answer)
  // alors on peut cliquer sur suivant
  // et le bouton change de couleur pour du vert
  // sinon, le bouton devient rouge
  // le bouton attaché à la bonne réponse devient vert
  // et le bouton suivant reste non cliquable
  
  function CheckAnswer() {
    const buttons = document.querySelectorAll('.btn'); // Sélectionner tous les boutons générés
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const questionActuelle = quizVoyage.questions[i]; // Récupérer la question actuelle
        const correctAnswer = questionActuelle.correct_answer
        buttons.forEach(btn => btn.setAttribute('disabled' , ''))
        if (button.textContent === correctAnswer) {
          button.style.backgroundColor = "#008000";
          score++; 
        } else {
          button.style.backgroundColor = "#FF0000";
        }
        console.log("score", score, "sur", quizVoyage.questions.length);
        console.log("Réponse choisie :", button.textContent);
        console.log("Bonne réponse :", questionActuelle.correct_answer);
      });
    });
  }
  // Afficher une réponse différente selon le score obtenu
  function commentaireScore() {
  let text;
  switch(score){
    case 0 :
      text = 'Aïe ! On dirait que ce sujet ne t’inspire vraiment pas… 🌀';
      break;
    case 1 :
    case 2 :
    case 3 :
      text = 'Ce n’est pas mal ! Mais tu peux mieux faire 💪!';
      break;
    case 4 :
    case 5 :
    case 6 :
      text = 'Bravo, on voit que tu maîtrises ce thème 😎 !';
      break;
    case 7 :
      text = 'Incroyable ! Tu es incollable sur le sujet 🎊!';
  }
  return text
  }

  console.log(score, "sur", quizVoyage.questions.length);