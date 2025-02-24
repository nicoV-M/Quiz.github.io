// Import des questions
import { quizVoyage } from './questions.js';

// Variables pour suivre l'état du quiz
let i = 0;
let score = 0;
let dernierScore;
let numberProgress = 1; // Barre de progression
const totalQuestions = quizVoyage.questions.length; // Nombre total de questions

// Sélection des éléments HTML
const contenuQuestion = document.querySelector('#question-text');
const contenuOptions = document.querySelector('#options-container');
const contenuFinal = document.querySelector('#message-final')
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
  // Ajout d'animation css sur la question et les reponses
  contenuOptions.classList.remove("scale-in-center-normal");
  contenuQuestion.classList.remove("scale-in-center-normal");
//   void contenuOptions.offsetWidth;
//   void contenuQuestion.offsetWidth;
setTimeout(()=> {
    contenuOptions.classList.add("scale-in-center-normal");
    contenuQuestion.classList.add("scale-in-center-normal");
}, 0);

  CheckAnswer();
  timer();
}

// Ajouter un temps imparti pour répondre
let timerId;
function timer() {
  clearTimeout(timerId);
  timerId = setTimeout(timeIsUp, 30000); // Modifier le timer pour effectuer des tests
}

function timeIsUp() {
  stopTimer();
  contenuQuestion.innerText = '';
  contenuOptions.innerHTML = '';
  contenuFinal.innerHTML = `Oups, temps écoulé ! <br> Tu veux recommencer ?`;
  boutonSuivant.style.display = 'none'; // Cacher le bouton Suivant
  restartGame.style.display = 'inline-block'; // Afficher le bouton restartGame
}

  // Arreter le timer au clique d'une réponse
  function stopTimer() {
    clearTimeout(timerId);
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
  } else {          // Fin du quiz
    contenuQuestion.innerText = '';
    contenuOptions.innerHTML = '';

     // Stocker le score final
     dernierScore = score;
     localStorage.setItem('dernierScore', score);

     // ✅ Gérer le meilleur score
    let meilleurScore = localStorage.getItem('meilleurScore') || 0;
    if (score > meilleurScore) {
      localStorage.setItem('meilleurScore', score);
      meilleurScore = score; // Met à jour pour l'affichage
    }
    console.log("Fin du quiz atteinte");

    contenuFinal.innerHTML = `All done ! <br>
    Tu as obtenu ${score} sur ${quizVoyage.questions.length}.
    <br>${commentaireScore(score, meilleurScore)}`;

    boutonSuivant.style.display = 'none'; // Cacher le bouton Suivant
    restartGame.style.display = 'inline-block'; // Afficher le bouton restartGame  

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
  contenuFinal.innerHTML = '';
  
  loadQuestion(); // Recharger la première question
});

// Fonction pour vérifier la réponse
function CheckAnswer() {
  const buttons = document.querySelectorAll('.btn');
  boutonSuivant.setAttribute('disabled', ''); // Désactiver le bouton suivant jusqu'à ce que l'utilisateur ait répondu

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      stopTimer();
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

// Afficher une réponse différente selon le score obtenu
  function commentaireScore(score, meilleurScore) {
  let text;
  
  if (score === 0) {
    text = 'Aïe ! On dirait que ce sujet ne t’inspire vraiment pas… 🌀';
  } else if (score <= 3) {
    text = 'Ce n’est pas mal ! Mais tu peux mieux faire 💪!';
  } else if (score <= 6) {
    text = 'Bravo, on voit que tu maîtrises ce thème 😎 !';
  } else if (score === 7) {
    text = 'Incroyable ! Tu es incollable sur le sujet 🎊!';
      lancerConfetti();
  }
      return `${text}<br><br>🎯 Dernier score : ${dernierScore} / ${quizVoyage.questions.length}<br>🏆 Meilleur score : ${meilleurScore} / ${quizVoyage.questions.length}`;
    }

    function lancerConfetti() {
      const duration = 5 * 1000; // 5 secondes
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > animationEnd) {
          return clearInterval(interval);
       }

    confetti({
    particleCount: 300,
    spread: 500,
    startVelocity: 50,
    gravity: 0.5,
    decay: 0.95,
    scalar: 1.1,
    origin: { x: Math.random(), y: Math.random() * 0.5 },
  });
}, 300);
}
 
console.log(score, "sur", quizVoyage.questions.length);
