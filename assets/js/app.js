function hsdeckcase() {
	this.signInButton = document.getElementById('signIn');
	this.signOutButton = document.getElementById('signOut');
	this.signInButton.addEventListener('click', this.signIn.bind(this));
	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.initFirebase();
};

hsdeckcase.prototype.signIn = function () {
	var provider = new firebase.auth.GoogleAuthProvider();
	this.auth.signInWithPopup(provider);
};

hsdeckcase.prototype.signOut = function () {
	this.auth.signOut();
};

hsdeckcase.prototype.initFirebase = function () {
	this.auth = firebase.auth();
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

hsdeckcase.prototype.onAuthStateChanged = function (user) {
	if (user) {
		console.log(":D");
	} else {
		console.log(":(");
	}
};

$(document).ready(function () {
	// $('.materialboxed').materialbox();
	hsdeckcase = new hsdeckcase();
	recomend();
	$('#icon_prefix').val('');
});

function recomend() {
	$.ajax({
		url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards?attack=1&collectible=1',
		headers: { 'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI' },
		success: function (data) {
			let array = $.map(data, function (value, index) {
				return [value];
			});
			console.log(data);
			let newExpansion = array[9];
			$(newExpansion).each(function (i) {
				console.log(newExpansion[i].img);
				$('#recomendation').append(
					`<img class="responsive-img" src="${newExpansion[i].img}">`
				);

			});
		}
	});
}

$('#searchBar').submit(function (e) {
	e.preventDefault();
	let userSearch = $('#icon_prefix').val();
	console.log(userSearch);
	$('#icon_prefix').val('');

	$.ajax({
		url: `https://omgvamp-hearthstone-v1.p.mashape.com/cards/${userSearch}`,
		headers: { 'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI' },
		success: function (data) {
			console.log(data);
			$('#recomendation').empty();
			for (let i = 0; i < data.length; i ++) {
				console.log(data[i].imgGold);

				$('#recomendation').append(
					`<img class="responsive-img" src="${data[i].imgGold}">`
				);


			}
		}
	})	
});