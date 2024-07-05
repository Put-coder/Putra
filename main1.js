// Retrieve the word list from local storage, or initialize an empty list if not available
let wordList = JSON.parse(localStorage.getItem('wordlist')) || [];

// Function to handle the button click event for fetching word definitions
function buttonClicked() {
  const word = document.getElementById("word").value;
  const partOfSpeech = document.getElementById("part-of-speech").value;

  // Fetch the word definition from the dictionary API
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
      const meanings = data[0].meanings;
      let foundMeaning = false;

      // Loop through the meanings to find the one that matches the selected part of speech
      for (const meaning of meanings) {
        if (meaning.partOfSpeech === partOfSpeech) {
          foundMeaning = true;
          let definitionList = "";

          // Create the definition list HTML
          meaning.definitions.forEach((definition, index) => {
            definitionList += `
              <div class="definition-container">
                <h4>Definition ${index + 1}</h4>
                <li>Definition: ${definition.definition || "-"}</li>
                <li>Example: ${definition.example || "-"}</li>
                <li>Synonyms: ${definition.synonyms ? definition.synonyms.join(", ") : "-"}</li>
                <li>Antonyms: ${definition.antonyms ? definition.antonyms.join(", ") : "-"}</li>
                <button class="save-definition-btn"
                        data-word="${data[0].word}"
                        data-part-of-speech="${partOfSpeech}"
                        data-definition="${definition.definition ? definition.definition.replace(/'/g, "\\'") : ''}"
                        data-example="${definition.example ? definition.example.replace(/'/g, "\\'") : ''}"
                        data-synonyms="${definition.synonyms ? definition.synonyms.join(', ').replace(/'/g, "\\'") : ''}"
                        data-antonyms="${definition.antonyms ? definition.antonyms.join(', ').replace(/'/g, "\\'") : ''}">
                  📒 Save this definition
                </button>
              </div>
            `;
          });

          // Display the definitions
          document.getElementById("displayDefinition").innerHTML = `Definitions of ${data[0].word} as a ${partOfSpeech}: ${definitionList}`;

          // Find and display the audio and related URL
          let audio;
          for (const phonetic of data[0].phonetics) {
            if (phonetic.audio !== "") {
              audio = phonetic;
              break;
            }
          }
          const relatedURL = audio ? audio.sourceUrl : "-";

          document.getElementById("displaySounds").innerHTML = `Audio 🎶 : ${audio ? `<audio src="${audio.audio}" controls></audio>` : "-"}`;
          document.getElementById("displayRelatedURL").innerHTML = `Related URL: ${relatedURL === "-" ? relatedURL : `<a href="${relatedURL}" target="_blank">${relatedURL}</a>`}`;
          break;
        }
      }

      // Alert if no definition is found for the selected part of speech
      if (!foundMeaning) {
        alert(`No definition found for ${word} as a ${partOfSpeech}`);
      }
    })
    .catch(error => {
      console.error(error);
      alert("An error occurred while fetching data.");
    });
}

// Function to display the note modal and save the note
function showNoteModal(word, partOfSpeech, definition, example, synonyms, antonyms) {
  const modal = document.getElementById('noteModal');
  modal.style.display = 'block';

  document.getElementById('saveNoteBtn').onclick = function() {
    const note = document.getElementById('noteInput').value;
    const confirmed = confirm("Are you sure you want to add this definition to the Word of the Day?");
    if (confirmed) {
      const definitionEntry = {
        word: word,
        partOfSpeech: partOfSpeech,
        definition: definition,
        example: example,
        synonyms: synonyms,
        antonyms: antonyms,
        note: note
      };
      // Add the definition to the word list and save it to local storage
      wordList.push(definitionEntry);
      localStorage.setItem('wordlist', JSON.stringify(wordList));
      alert("Definition added to Word of the Day!");
      modal.style.display = 'none';
    }
  };
}

// Event listener to handle the save definition button click event
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('displayDefinition').addEventListener('click', e => {
    if (e.target.classList.contains('save-definition-btn')) {
      const word = e.target.dataset.word;
      const partOfSpeech = e.target.dataset.partOfSpeech;
      const definition = e.target.dataset.definition;
      const example = e.target.dataset.example;
      const synonyms = e.target.dataset.synonyms;
      const antonyms = e.target.dataset.antonyms;
      showNoteModal(word, partOfSpeech, definition, example, synonyms, antonyms);
    }
  });

  // Close the modal when the close button or outside area is clicked
  const modal = document.getElementById('noteModal');
  const closeBtn = document.querySelector('.close');
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
});

// Function to generate random words and display them
function generateRandomWords() {
  fetch('https://random-word-api.herokuapp.com/word?number=15')
    .then(response => response.json())
    .then(data => {
      const wordsContainer = document.getElementById("random-words");
      wordsContainer.innerHTML = ""; // Clear previous words

      data.forEach(word => {
        const wordElement = document.createElement("div");
        wordElement.className = "grid-item";
        wordElement.textContent = word;
        
        // Set the input field value to the clicked word
        wordElement.onclick = () => {
          document.getElementById("word").value = word;
        };
        wordsContainer.appendChild(wordElement);
      });
    })
    .catch(error => {
      console.error('Error fetching random words:', error);
      alert("An error occurred while fetching random words.");
    });
}
