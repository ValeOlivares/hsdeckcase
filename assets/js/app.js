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

window.onload = function() {
	hsdeckcase = new hsdeckcase();
};