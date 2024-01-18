const dropdownItems = document.querySelectorAll('.dropdown-item');

const candidates = ['Harinarayan Prajapati', 'Vikas Sahu', 'Praveen Jaiswal', 'Rishab(Bauvaa) Jaiswal'];
let voteData = {};

function initializeVoteData() {
    for (const candidate of candidates) {
        voteData[candidate] = {
            _id: null,
            count: 0,
            voters: []
        };
    }
}

initializeVoteData();


function selectCandidate(item) {
    // Remove "active" class from all items
    dropdownItems.forEach(function (element) {
        element.classList.remove("active");
    });

    // Add "active" class to the clicked item
    item.classList.add("active");
}


function castVote() {

    const voterNameInput = document.getElementById('voterName').value;

    if (!voterNameInput) {
        alert('Please Enter Voter Name');
        return;
    }

    const selectedCandidate = getSelectedCandidate();

    //alert(voterNameInput);
    //console.log(voterNameInput);
    //alert(selectedCandidate);
    //console.log(selectCandidate);

    // Perform actions with the retrieved values
    axios.post('https://crudcrud.com/api/16ffc91b7bea46e9bc04549f02bd1945/voteData', { selectedCandidate, voterNameInput })
    .then(response => {
      voteData[selectedCandidate]._id = response.data._id;
      voteData[selectedCandidate].count++;
      voteData[selectedCandidate].voters.push({
         _id: response.data._id,
         name: voterNameInput 
        });
      
        updateVote();
    })
    .catch(error => {
      console.error('Error submitting vote:', error);
    });

}


function getSelectedCandidate() {

    for (const item of dropdownItems) {
        if (item.classList.contains('active')) {
            return item.textContent.trim();
        }
    }

    return null;
}


function deleteVote(voterId, selectedCandidate) {

    axios.delete(`https://crudcrud.com/api/16ffc91b7bea46e9bc04549f02bd1945/voteData/${voterId}`)
    .then(response => {
      const voterIndex = voteData[selectedCandidate].voters.findIndex(voter => voter._id === voterId);
      voteData[selectedCandidate].voters.splice(voterIndex, 1);
      voteData[selectedCandidate].count--;
      updateVote();
    })
    .catch(error => {
      console.error('Error deleting vote:', error);
    });

}


function updateVote() {
    const voteList = document.getElementById('voteList');
    voteList.innerHTML = '';

    let totalVotes = 0;

    for (const candidate of candidates) {
        totalVotes += voteData[candidate].count;
    }

    for (const candidate of candidates) {
        const listItem = document.createElement('li');
        listItem.className = 'vote-item';
        let candidateNameWithoutSpaces = candidate.replace(/\s/g, ''); // Remove spaces from candidate name
        const percentage = totalVotes !== 0 ? ((voteData[candidate].count / totalVotes) * 100).toFixed(2) : 0;

        listItem.innerHTML = `
            <div class="section1" style="width: 45%; text-align: left;">
                ${candidate}
                <img src="./CandidatePartyImage/${candidateNameWithoutSpaces.toLowerCase()}.png" alt="${candidateNameWithoutSpaces} Logo" class="candidate-logo" width="40" height="35">
            </div>
            <div class="section2" style="width: 50%;">
                ${voteData[candidate].voters.map(voter => `<div class="delete-button" onclick="deleteVote('${voter._id}', '${candidate}')">${voter.name} ✖</div>`).join('')} 
                Total: ${voteData[candidate].count} (${percentage}%)
                <div class="percentage-bar" style="width: ${percentage}%; background-color: #3498db; border: 1px solid #2980b9;"></div>
            </div>`;
            
        voteList.appendChild(listItem);
    }

    document.getElementById('totalVotes').innerText = totalVotes;
}




