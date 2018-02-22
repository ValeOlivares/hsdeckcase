$(document).ready(function () {
	// $('.materialboxed').materialbox();
	hsdeckcase = new hsdeckcase();
	recommend();
	$('#icon_prefix').val('');
});

function hsdeckcase() {
	this.signInButton = document.getElementById('signIn');
	this.signOutButton = document.getElementById('signOut');
	this.account = document.getElementById('account');
	this.signInButton.addEventListener('click', this.signIn.bind(this));
	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.account.addEventListener('click', loadProfile.bind(this));
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
	this.database = firebase.database();
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

hsdeckcase.prototype.onAuthStateChanged = function (user) {
	if (user) {
		console.log(":D");
	} else {
		console.log(":(");
	}
};

var loadProfile = function () {
	console.log('loadprofile');
	
  var profRef = firebase.database().ref('profile');
  var currentUser = firebase.auth().currentUser;

  var searchId = function (snapshot) {
    var obj = snapshot.val();

    for (key in obj) {
			console.log(obj);
			
      if (obj.hasOwnProperty(key)) {
        if (currentUser) {
					console.log('current user exists');
					
          if (currentUser.uid === obj[key].userUid) {
            console.log(obj[key]);
          }
        }
      }
    }
  };
  profRef.on("value", searchId);
};

var saveProfile = function (cardId, deck1 ,btn) {
  console.log(firebase.auth().currentUser);
  let user = firebase.auth().currentUser;

  if ($(user).length) {
    console.log('funcion saveProfile activated');
    btn.style.color = 'green';
    let profileRef = firebase.database().ref('profile');
    profileRef.off();

    const currentUser = firebase.auth().currentUser;
    profileRef.push({
      deck1: [cardId],
      userUid: currentUser.uid,
    });

  } else {
    alert('Por favor inicia sesion primero.')
  }
};

function createUser(cardId, deck1 ,btn) {
	let userId = firebase.auth().currentUser.uid;

	btn.style.color = 'green';
	let newUserRef = firebase.database().ref(`users/${userId}`);
	newUserRef.set({
		'decks': {}
	});

	addDeck(cardId, deck1 ,btn);
	addCardToDeck(cardId, deck1 ,btn);
};

function addDeck(cardId, deck1 ,btn) {
	let userId = firebase.auth().currentUser.uid;
	let decksRef = firebase.database().ref(`users/${userId}/decks/${deck1}`);
	
	decksRef.set({
		'cards': {}
	});

	addCardToDeck(cardId, deck1 ,btn);
};

function addCardToDeck(cardId, deck1 ,btn) {
	let userId = firebase.auth().currentUser.uid;
	let cardsRef = firebase.database().ref(`users/${userId}/decks/${deck1}/cards`);

	let newCardRef = cardsRef.push();
	newCardRef.set({
  	'cardId': cardId,
	});
};

function recommend() {
	$.ajax({
		url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/LOOT_044',
		headers: { 'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI',
								'Accept': 'application/json'},
		success: function (data) {

			console.log(data[0]);
			let max = data.length -1;
			let min = 0;
			let arr = []
			for (let i = 0; i < 16; ) {
				let random = Math.floor(Math.random() * (max - min + 1)) + min;
				if (!arr.includes(random)) {
					arr.push(random);
					i++

					console.log(arr);
				}
				

			}

			for (e of arr) {
				console.log(data[e].cardId);
				
				$('#recomendation').append(
					`<div class="col m4">
					<img class="responsive-img" src="${data[e].img}">
					<button onclick="addCardToDeck('${data[e].cardId}', 'deck1',this)">Add</button>
					</div>`
				);	
			}
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
				`<div class=" col m3 s2">` +
					`<img class="responsive-img" src="${data[i].imgGold}">` +
					`<div class="fixed-action-btn horizontal click-to-toggle buttons">` +
					`<a>` +
    					`<img src="assets/images/icon.png" alt="" class="material-icons icon"> ` +
   					 `</a>` +
   						 `<ul>` +
     						 `<li><a class="btn-floating yellow darken-1"><i class="material-icons">favorite_border</i></a></li>` +
     					 	`<li><a class="btn-floating yellow darken-1"><i class="material-icons">info_outline</i></a></li>` +
     					 	`<li><a class="btn-floating yellow darken-1"><i class="material-icons">publish</i></a></li>`+
      						`<li><a class="btn-floating yellow darken-1"><i class="material-icons">attach_file</i></a></li>` +
    					`</ul>` +
  					`</div>` +
 				`</div>`
				);
			}
		}
	})	
});