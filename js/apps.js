var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];

(function() {

  function getAllApps() {

    navigator.mozApps.mgmt.getAll().onsuccess = function(event) {

      console.log(event.target.result);

      event.target.result.forEach(function(app, i) {

        if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
          return;
        }

        var _path = app.origin;

        if(!app.manifest.icons) {
          return;
        } 

        var findSmallest = function(icons) {
          var l;
          for(var k in icons) {
            if(!l) l = k;
            if(l > k) {
              continue;
            }
            l = k;
          }
          return l;
        }

        // find the smallest icon url.
        var l = findSmallest(app.manifest.icons);
        var icon = app.manifest.icons[l];

        if(!icon) {
          return;
        }

        var url = _path + icon;

        var img = new Image;
        img.onload = didLoad;
        img.onerror = didFail;
        img.src = url;

        function didFail() {
          console.log("error loading:", url);
        }

        function didLoad() {

          console.log(url, img.width, img.height);

          var s = img.width;

          var body = Matter.Bodies.rectangle(50+(i%gridWidth)*64, 50+Math.floor(i/gridWidth)*64, 64, 64, {
            render: {
              sprite: {
                texture: url
              }
            }
          });

          body.app = app;

          World.addBody(engine.world, body);

        }

      });

    };

  }

  var width  = document.body.offsetWidth;
  var height = document.body.offsetHeight;

  var Engine          = Matter.Engine;
  var World           = Matter.World;
  var Bodies          = Matter.Bodies;
  var MouseConstraint = Matter.MouseConstraint;
  var Events          = Matter.Events;

  var engine = Engine.create(document.body, {
    render: {
      options: {
        width:      width,
        height:     height,
        wireframes: false
      }
    }
  });

  var mouseConstraint = MouseConstraint.create(engine);
  World.add(engine.world, mouseConstraint);

  var mouseConstraint = MouseConstraint.create(engine);
  World.add(engine.world, mouseConstraint);

  // some settings
  var ofs         = 30;
  var thickness   = 100;
  var wallOptions = { 
    isStatic: true,
    render: {
      visible: true
    }
  };

  var cx = Math.floor(width/2);
  var cy = Math.floor(height/2);

  var gridWidth = Math.floor(width/64);
  console.log("grid width", gridWidth);

  // add some invisible some walls to the world
  World.add(engine.world, [
    Bodies.rectangle(cx,             -ofs,          width + 2*ofs, thickness,      wallOptions),
    Bodies.rectangle(cx,             height+ofs,    width + 2*ofs, thickness,      wallOptions),
    Bodies.rectangle(width+ofs,      cy,            thickness,     height + 2*ofs, wallOptions),
    Bodies.rectangle(-ofs,           cy,            thickness,     height + 2*ofs, wallOptions)
  ]);

  Engine.run(engine);

  var updateGravity = function(event) {
    engine.world.gravity.y = (event.beta / 360) * 4;
    engine.world.gravity.x = (event.gamma / 360) * 4;
  }

  window.addEventListener("deviceorientation", updateGravity);

  getAllApps();

  var x = 0, y = 0;

  Events.on(engine, "mousemove",  function(event) {

    x = event.mouse.position.x;
    y = event.mouse.position.y;

  });

  var g = false;

  Events.on(engine, "mouseup", function(event) {
    g = false;
  });

  Events.on(engine, "mousedown", function(event) {

    // stop event firing twice
    if(!g) {
      g = true;
      return;
    } else {
      g = false;
    }

    var apps = event.source.world.bodies;

    for(var i = 0; i < apps.length; i++) {

      var app = apps[i];

      if(x <= app.bounds.max.x && x >= app.bounds.min.x && y <= app.bounds.max.y && y >= app.bounds.min.y) {

        var a = app.app;
        if (a.manifest.entry_points) {
          a.launch(0);
        } else {
          a.launch();
        }

      }

    }

  });

})();
