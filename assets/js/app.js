$(document).ready(function () {
  // $('.materialboxed').materialbox();
  hsdeckcase = new hsdeckcase();
  recommend();
  $('#icon_prefix').val('');
  $('.collapsible').collapsible();
  $('.modal').modal();

});

function hsdeckcase() {
  this.signInButton = document.getElementById('signIn');
  this.signOutButton = document.getElementById('signOut');
  this.account = document.getElementById('account');
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.account.addEventListener('click', showDecks.bind(this));
  this.initFirebase();
};

hsdeckcase.prototype.signIn = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
  $('div > a').removeClass('hide');
};

hsdeckcase.prototype.signOut = function () {
  this.auth.signOut();
  $('#recommendation').empty();
  recommend();
  $('div > a').addClass('hide');
};

hsdeckcase.prototype.initFirebase = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

hsdeckcase.prototype.onAuthStateChanged = function (user) {
  if (user) {
    $('#signOut').removeClass('hide');
    $('#account').removeClass('hide');
    $('div > a').removeClass('hide');
    $('#signIn').addClass('hide');
    loadProfile();
  } else {
    $('#signOut').addClass('hide');
    $('#account').addClass('hide');
    $('#signIn').removeClass('hide');
  }
};
let userDecks;

var loadProfile = function() {

  let usersRef = firebase.database().ref('users');
  const currentUser = firebase.auth().currentUser;

  usersRef.on('value', function(snapshot) {
    const users = snapshot.val();
    for (uid in users) {
      if (currentUser.uid === uid) {
        userDecks = users[uid].decks;
        $('#selectMenu').empty();
        $('#selectMenu').append(
          `<select id="deckList">
          <option value="" disabled selected>Add to an Existing Deck</option>
        </select>`
        );
        for (key in userDecks) {
          $('#deckList').append(
            `<option value="${key}">${key}</option>`
          );
        }
      }
    }
    $('#submit').click(function() {
      let deck = $('#deckList').val()
      if (deck !== null) {
        $('#modalAdd').modal('close');
        addCardToDeck(id, deck);
      }
    });
    $('select').material_select();
  });
};

$('#submitNewDeck').click(function(event) {
  create(event);
});
$('#newDeck').on('keypress', function(event) {
  create(event);
});

let create = function(event) {
  let deck = $('#newDeck').val();
  if (event.which === 13) {
    $('#modalAdd').modal('close');
    $('#newDeck').val('');
    addDeck(id, deck);
  }
};

function showDecks() {
  let counter = 0;
  $('#recommendation').empty();
  $('#recommendation').append(`
    <ul id="decksMenu" class="collapsible" data-collapsible="accordion"></ul>
    `);
  let decks = userDecks;

  let captureHelper = function (obj, counter) {
    cardsOnDeck(obj, counter);
  }

  for (key in decks) {

    $('#decksMenu').append(
      `<li>
        <div id="btn_${counter}" class="collapsible-header">${key}</div>
        <div id="body_${counter}" class="collapsible-body"></div>
      </li>`
    );
    captureHelper(decks[key].cards, counter);
    counter++;
    $('.collapsible').collapsible();
  }
}

function cardsOnDeck(cards, counter) {
  for (key in cards) {
    let card = cards[key].cardId;
    $.ajax({
      url: `https://omgvamp-hearthstone-v1.p.mashape.com/cards/${card}`,
      headers: {
        'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI',
        'Accept': 'application/json'
      },
      success: function (data) {
        for (let i = 0; i < data.length; i++) {
          $(`#body_${counter}`).append(
            `<img class="responsive-img" src="${data[i].img}">`
          );
        }
      }
    });
  }
}

function createUser(cardId, deck) {
  let userId = firebase.auth().currentUser.uid;
  let newUserRef = firebase.database().ref(`users/${userId}`);
  newUserRef.set({
    'decks': {}
  });

  addDeck(cardId, deck);
  addCardToDeck(cardId, deck);
};

function addDeck(cardId, deck) {
  let userId = firebase.auth().currentUser.uid;
  let decksRef = firebase.database().ref(`users/${userId}/decks/${deck}`);

  decksRef.set({
    'cards': {}
  });

  addCardToDeck(cardId, deck);
};

function addCardToDeck(cardId, deck) {
  let userId = firebase.auth().currentUser.uid;
  let cardsRef = firebase.database().ref(`users/${userId}/decks/${deck}/cards`);

  let newCardRef = cardsRef.push();
  newCardRef.set({
    'cardId': cardId,
  });
};

function recommend() {
  $('#recommendation').empty();
  $.ajax({
    url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/sets/Kobolds%20%26%20Catacombs?collectible=1',
    headers: {
      'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI',
      'Accept': 'application/json'
    },
    success: function(data) {

      let max = data.length - 1;
      let min = 0;
      let arr = [];
      for (let i = 0; i < 16;) {
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!arr.includes(random)) {
          arr.push(random);
          i++;
        }
      }

      let user = firebase.auth().currentUser;
      if (!user) {
        for (e of arr) {
          $('#recommendation').append(
            `<div class="col s12 m2 l3">
              <div class="row">
                <img class="responsive-img" src="${data[e].img}">
              </div>
              <div class="row">
              <a  class="addcards hide waves-effect waves-light btn black amber-text text-lighten-1 modal-trigger" href="#modalAdd" data="${data[e].cardId}" onclick="showCardId(this)">Add</a>
            </div>`
          );
        }
      } else {
        for (e of arr) {
          $('#recommendation').append(
            `<div class="col s12 m2 l3">
              <div class="row">
                <img class="responsive-img" src="${data[e].img}">
              </div>
              <div class="row">
              <a  class="addcards waves-effect waves-light btn black amber-text text-lighten-1 modal-trigger" href="#modalAdd" data="${data[e].cardId}" onclick="showCardId(this)">Add</a>
            </div>`
          );
        }
      }
    }
  });
}
let id;
function showCardId(cardId) {
  loadProfile();
  id = $(cardId).attr('data');
}

$('#searchBar').submit(function (e) {
  e.preventDefault();
  let userSearch = $('#icon_prefix').val();
  $('#icon_prefix').val('');

  $.ajax({
    url: `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${userSearch}?collectible=1`,
    headers: { 'X-Mashape-Key': 'NJIHT5oJPOmshEzdDx649UwbKafBp1ZU9GKjsniDdm9PGi4hNI' },
    success: function(data) {
      $('#recommendation').empty();
      for (let i = 0; i < data.length; i++) {
        if (data[i].img === undefined) {

        } else {
          let user = firebase.auth().currentUser;
          if (!user) {
            $('#recommendation').append(
              `<div class="col s12 m2 l3">
                <div class="row">
                  <img class="responsive-img" src="${data[i].img}">
                </div>
                <div class="row">
                <a  class="addcards hide waves-effect waves-light btn black amber-text text-lighten-1 modal-trigger" data="${data[i].cardId}" onclick="showCardId(this)" href="#modalAdd">Add</a>
              </div>`
            );

          } else {
            $('#recommendation').append(
              `<div class="col s12 m2 l3">
                <div class="row">
                  <img class="responsive-img" src="${data[i].img}">
                </div>
                <div class="row">
                <a  class="addcards waves-effect waves-light btn black amber-text text-lighten-1 modal-trigger" href="#modalAdd" data="${data[i].cardId}" onclick="showCardId(this)">Add</a>
              </div>`
            );
          }
        }
      }
    }
  });
});

