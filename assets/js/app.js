function hsdeckcase() {
	this.signInButton = document.getElementById('signIn');
	this.signOutButton= document.getElementById('signOut');
	this.signInButton.addEventListener('click', this.signIn.bind(this));
	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.initFirebase();
};

hsdeckcase.prototype.signIn = function() {
	var provider = new firebase.auth.GoogleAuthProvider();
	this.auth.signInWithPopup(provider);
};

hsdeckcase.prototype.signOut = function() {
	this.auth.signOut();
};

hsdeckcase.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

hsdeckcase.prototype.onAuthStateChanged = function(user) {
  if (user) { 
   console.log(":D");
   } else {
   	console.log(":(");
   }
};

$(document).ready(function(){
	// $('.materialboxed').materialbox();
	hsdeckcase = new hsdeckcase();
	recomend();
});

function recomend() {
	$.ajax({
    url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards?attack=1&collectible=1',
    headers: { 'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI' },
    success : function (data) {
      let array = $.map(data, function(value, index) {
        return [value];
      });
      console.log(data); 
      let newExpansion = array[9];
      console.log(newExpansion.lenght);
      $(newExpansion).each(function(i) {
				console.log(newExpansion[i].img);
				$('#recomendation').append(
					`<img class="responsive-img" src="${newExpansion[i].img}">`
				);
        
      });
	 	}
	});
}