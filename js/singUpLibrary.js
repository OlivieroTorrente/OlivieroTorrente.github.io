//utilizzato per aprire la pagina di sing up
var modal = document.getElementById('id01');


// utilizzato per chiudere il sing up se si clicca fuori dalla finestra form
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById('logoImg').style.display='block';
    document.getElementById('tryNowBut').style.display='block';
  }
}

//funzione bottone try now 
function tryNowFunction() {
  document.getElementById('id01').style.display='block';
  document.getElementById('logoImg').style.display='none';
  document.getElementById('tryNowBut').style.display='none';
}

//funzione bottone canel e closeModal per tornare indietro
function cancelButtonFunction() {
  document.getElementById('id01').style.display='none';
  document.getElementById('logoImg').style.display='block';
  document.getElementById('tryNowBut').style.display='block';
}

//salvataggio dei dati inseriti in local storage
function fuctonSaveDateButton() {


  const buisnessName = document.getElementById("CompanyName").value;
  const startDate = document.getElementById("start").value;
  const endDate = document.getElementById("end").value;

  localStorage.setItem("NOMERES", buisnessName);
  localStorage.setItem("STARTRES", startDate);
  localStorage.setItem("ENDRES", endDate);
  
  return;
};