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
  void contenuQuestion.offsetWidth;
  contenuOptions.classList.add("scale-in-center-normal");
  contenuQuestion.classList.add("scale-in-center-normal");

  checkAnswer(); 
}

let timeLeft = 15 ; // Initialisation du décompte à x secondes
const timerElement = document.getElementById('timer'); // Référence à l'élément où le décompte sera affiché
let interval = setInterval(updateTimer, 1000); // Définir un intervalle de mise à jour chaque seconde (1000 ms)

function timer() {
  timeLeft = 15; // Réinitialiser le temps à 15 secondes
  clearInterval(interval); // Arrêter l'intervalle précédent
  interval = setInterval(updateTimer, 1000);
  updateTimer();
}

// Fonction pour mettre à jour l'affichage du timer
function updateTimer() {
  // Calculer les minutes et les secondes
  const minutes = Math.floor(timeLeft / 60);  // Calcul des minutes 
  const seconds = timeLeft % 60;              // Calcul des secondes restantes (modulo de timeLeft par 60)

  // Formater les minutes et secondes pour les afficher sous la forme "00:15"
  timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;

  timeLeft--;  // Décrémenter le temps restant

  if (timeLeft < 0) {
      stopTimer();  // Arrêter le décompte
      contenuQuestion.innerText = '';
      contenuOptions.innerHTML = '';
      contenuFinal.innerHTML = `Oups, temps écoulé ! <br> Tu veux recommencer ?`;
      boutonSuivant.style.display = 'none'; // Cacher le bouton Suivant
      restartGame.style.display = 'inline-block'; // Afficher le bouton restartGame
      timerElement.textContent = "Time's up !";  // Afficher un message quand le temps est écoulé
  }
}

// Fonction pour formater les nombres (ajoute un 0 devant si nécessaire)
function formatTime(time) {
  //return time < 10 ? `0${time}` : time;
  let formattedTime 
  if (time < 10) {
    formattedTime = `0${time}`;
  } else {
    formattedTime = time;
  }
  return formattedTime;
}

// Arreter le timer au clique d'une réponse
function stopTimer() {
  clearInterval(interval);
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
    timer(); // Lancer le timer
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
  timer(); // Lancer le timer
});

// Fonction pour vérifier la réponse
function checkAnswer() {
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
        button.style.backgroundColor = "#CDF4D3"; // Bonne réponse en vert
        button.style.border = "2px solid #66D575";
        button.style.color = "#66D575";
        score++;
      } else {
        button.style.backgroundColor = "var(--red-light)"; // Mauvaise réponse en rouge
        button.style.border = "2px solid var(--red-strong)";
        button.style.color = "var(--red-strong)";
      }
      buttons.forEach(btn => {
        if(btn.textContent === correctAnswer){
          btn.style.backgroundColor = "var(--green-light)"; 
          btn.style.border = "2px solid var(--green-strong)";
          btn.style.color = "var(--green-strong)";
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
