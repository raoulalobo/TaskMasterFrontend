// test-connection.js
fetch('http://localhost:8000/api/properties/')
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    document.getElementById('result').innerText = 'Connexion réussie! ' + JSON.stringify(data);
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').innerText = 'Erreur: ' + error.message;
  });