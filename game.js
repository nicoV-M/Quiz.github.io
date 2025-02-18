import { quizVoyage } from './questions.js';

// Récupérer les emplacements pour injecter la question et les options
const contenuQuestion = document.querySelector('#question-text');
const contenuOptions = document.querySelector('#options-container');

// Récupérer la première question
const firstQuestion = quizVoyage.questions[0];
console.log(firstQuestion);


// Injecter le texte de la question dans l'emplacement dédié
contenuQuestion.innerText = firstQuestion.text;

// Pour chaque option, créer un bouton et l'ajouter au conteneur
firstQuestion.options.forEach(optionText => { 
    const newButton = document.createElement('button');
    newButton.innerText = optionText;
    console.log(newButton);
    newButton.classList.add('btn');
    contenuOptions.appendChild(newButton);
});