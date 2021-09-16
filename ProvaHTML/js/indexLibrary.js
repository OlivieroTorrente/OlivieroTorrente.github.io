
 


$(document).ready(function(){

	//nascondi e mostra la info, modifica l'icona CON LISTENER DINAMICO
	$("#info-container").on('click', '.infoShowButton',function(){
		$(this).siblings("p:first-of-type").fadeToggle("slow");
			$(this).toggleClass("infoHideButton");
	});

	//marca la info come letta, modifica l'icona CON LISTENER DINAMICO
	$("#info-container").on('click','.infoReadButton',function(){
		$(this).parent().toggleClass("infoRead");
		$(this).toggleClass("infoUnreadButton");
		$(this).siblings(".insertValueSpace").fadeToggle("slow");
	});
})



//recupero dati da SingUp per la creazione di un nuovo piano contabile
window.addEventListener('load', () => {
                       
    const buisnessName = localStorage.getItem('NOMERES');
    const startDate = localStorage.getItem('STARTRES');
    const endDate = localStorage.getItem('ENDRES');

    document.getElementById("resultName").innerHTML = buisnessName;
    
    document.getElementById("resultStart").innerHTML = startDate;

    document.getElementById("resultEnd").innerHTML = endDate;
	
});

