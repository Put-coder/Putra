// Event listener to handle DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load Word of the Day entries from local storage
  loadWOTD();

  // Event listener for click events on the table body
  document.getElementById('wotd-tbody').addEventListener('click', (e) => {
    // If the clicked element is a delete button
    if (e.target.classList.contains('delete-btn')) {
      const index = e.target.dataset.index; // Get the index of the entry to delete
      deleteWord(index); // Call the delete function
    } 
    // If the clicked element is an edit button
    else if (e.target.classList.contains('edit-btn')) {
      const index = e.target.dataset.index; // Get the index of the entry to edit
      editWord(index); // Call the edit function
    }
  });
});

// Function to load Word of the Day entries from local storage and display them in the table
function loadWOTD() {
  const wotdData = JSON.parse(localStorage.getItem('wordlist')) || []; // Get the word list from local storage
  const tbody = document.getElementById('wotd-tbody'); // Get the table body element
  tbody.innerHTML = ''; // Clear the table body

  // Iterate over each word entry and create table rows
  wotdData.forEach((data, index) => {
    const row = document.createElement('tr'); // Create a new table row
    row.innerHTML = `
      <td>${data.word}</td>
      <td>${data.partOfSpeech}</td>
      <td>
        <p>Definition: ${data.definition}</p>
        <p>Example: ${data.example}</p>
        <p>Synonyms: ${data.synonyms}</p>
        <p>Antonyms: ${data.antonyms}</p>
      </td>
      <td class="note-cell">
        <div class="note-content">${data.note}</div>
        <textarea class="note-textarea" style="display:none;">${data.note}</textarea>
        <button class="save-note-btn" style="display:none;">✅ Save</button>
      </td>
      <td>
        <button class="edit-btn styled-button" data-index="${index}">📝 Edit</button>
        <button class="delete-btn styled-button" data-index="${index}">❌ Delete</button>
      </td>
    `;
    tbody.appendChild(row); // Append the row to the table body
  });
}

// Function to delete a word entry from the word list
function deleteWord(index) {
  const confirmed = confirm("Are you sure you want to delete this entry?"); // Confirm deletion
  if (confirmed) {
    let wotdData = JSON.parse(localStorage.getItem('wordlist')) || []; // Get the word list from local storage
    wotdData.splice(index, 1); // Remove the entry at the specified index
    localStorage.setItem('wordlist', JSON.stringify(wotdData)); // Save the updated word list to local storage
    loadWOTD(); // Reload the Word of the Day entries
    alert("Entry deleted from Word of the Day!"); // Alert the user
  } else {
    console.log("Deletion canceled by user."); // Log if deletion is canceled
  }
}

// Function to edit a note for a word entry
function editWord(index) {
  const tbody = document.getElementById('wotd-tbody'); // Get the table body element
  const noteCell = tbody.querySelectorAll('.note-cell')[index]; // Get the note cell for the specified entry
  const noteContent = noteCell.querySelector('.note-content'); // Get the note content div
  const noteTextarea = noteCell.querySelector('.note-textarea'); // Get the note textarea
  const saveBtn = noteCell.querySelector('.save-note-btn'); // Get the save button

  const confirmed = confirm("Are you sure you want to edit this note?"); // Confirm editing
  if (confirmed) {
    noteContent.style.display = 'none'; // Hide the note content
    noteTextarea.style.display = 'block'; // Show the note textarea
    saveBtn.style.display = 'block'; // Show the save button

    // Event listener for save button click event
    saveBtn.addEventListener('click', () => {
      let wotdData = JSON.parse(localStorage.getItem('wordlist')) || []; // Get the word list from local storage
      let data = wotdData[index]; // Get the entry data
      data.note = noteTextarea.value; // Update the note with the new value
      wotdData[index] = data; // Update the word list entry
      localStorage.setItem('wordlist', JSON.stringify(wotdData)); // Save the updated word list to local storage
      loadWOTD(); // Reload the Word of the Day entries
      alert("Note edited successfully!"); // Alert the user
    });
  } else {
    console.log("Editing canceled by user."); // Log if editing is canceled
  }
}
