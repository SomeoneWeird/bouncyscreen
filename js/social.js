(function(){
  // Mocked friends
  var friends = [
    'vicky',
    'andrew',
    'mike',
    'dominica',
    'jan',
    'mac',
    'mack',
    'sandy',
    'jacob',
    'patricia',
    'donut',
    'jimmy',
    'agnes',
    'isabella',
    'julia',
    'maria',
    'franco',
    'meggie',
    'maya',
    'natalia',
    'paula',
    'sandra'
  ];
  
  // Randomize friends
  friends.sort(function() {
    return .5 - Math.random();
  });
  
  var parent = document.getElementById('social');
  var input = document.getElementById('social-input');
  var bigTile = document.getElementById('big-active-tile');
  var bigTileLabel = bigTile.getElementsByClassName('app-label')[0];
  
  friends.forEach(function(friend, index) {
    var dataset = { name: friend };
    if (index === 1) dataset.notifications = 1;

    var tile = createTile(
      'style/img/fb/' + friend + '.jpg',
      friend,
      dataset
    );
    
    parent.appendChild(tile);
  });
  
  parent.addEventListener('click', function(e) {
    if (!e.target.classList.contains('tile')) {
      return;
    }
    
    var container = e.target
    var name = container.dataset.name;
    input.value = '';
    
    if (container.dataset.notifications) {
      input.placeholder = 'Reply to ' + name.toUpperCase();
      delete container.dataset.notifications;
      container.removeChild(container.childNodes[0]);
      talkModule.clear();
      talkModule.createMsg('Hi, how are you?', true);
    } else {
      talkModule.clear();
      input.placeholder = 'Write to ' + name.toUpperCase();
    }
    
    document.body.classList.add('active');
    bigTile.style.backgroundImage = container.style.backgroundImage;
    bigTileLabel.innerHTML = name;
  });
  
  window.addEventListener('hashchange', function(e) {
    if (window.location.hash.indexOf('#root') > -1) {
      document.body.classList.remove('active');
    }
  });

  input.addEventListener('keypress', function(e){
    if (e.keyCode === 13) {
      talkModule.say(input.value);
      input.value = '';
      input.focus();
    }
  });
  
  var talkModule = (function() {
    var clear = function() {
      bigTile.innerHTML = '';
      bigTile.appendChild(bigTileLabel);
    };
    
    var createMsg = function(content, incoming) {
      var msg = document.createElement('div');
      msg.classList.add('msg');
      if (incoming) {
        msg.classList.add('incoming');
      } else {
        msg.classList.add('outgoing');
      }
      
      var id = Math.random().toString(36).slice(2).toUpperCase();
      msg.id = id;
      msg.textContent = content;
      
      bigTile.appendChild(msg);

      window.location.hash = "#" + id;
    }

    var say = function(what) {
      createMsg(what, false);
      
      setTimeout(function() {
        createAnswer(what);
      }, 2500);
    }
    
    var createAnswer = function(what) {
      var answer;
      var l = sentences.length;
      
      var rand = ~~(Math.random()*3)%3;
      if (rand === 1) {
        answer = what;
      } else {
        rand = ~~(Math.random()*l)%l;
        answer = sentences[rand];
      }
      createMsg(answer, true);
      
      rand = ~~(Math.random()*3)%3;
      if (rand === 1) {
        rand = ~~(Math.random()*l)%l;
        setTimeout(function(){ createAnswer(sentences[rand]); }, 1500);
      }
    }
    
    return {
      say: say,
      createMsg: createMsg,
      clear: clear
    }
  })();
  
  var sentences = [
    'LOL',
    'What? I don\'t understand..',
    'o.O',
    ':)',
    ':))))',
    'That\'s great!',
    '<3',
    'Wow, such homescreen. Wow.',
    'Yo, whatcha doin?',
    'It\'s -35 celsius in Poland today',
    'Are you serious?!?!',
    'How about Chris?',
    'That\'s awesome! But pls tell me more about yourself.',
    'FirefoxOS ROXXXXXX',
    'GAIA FTW!',
    'That\'s magnificent!',
    'Brilliant idea!',
    ' o-<-<):   <-- me on the skateboard',
    'Warsaw is an Alpha– global city, a major international tourist destination and an important economic hub in Central Europe. It is also known as the "phoenix city" because it has survived so many wars throughout its history.',
    'Warsaw lies in east-central Poland about 300 km (190 mi) from the Carpathian Mountains and about 260 km (160 mi) from the Baltic Sea, 523 km (325 mi) east of Berlin, Germany.',
    'BRB',
    'W8',
    '-.-'
  ]
})();
