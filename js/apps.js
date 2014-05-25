var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];


(function() {

  function getAllApps() {

    navigator.mozApps.mgmt.getAll().onsuccess = function(event) {

      // console.log(event.target.result);

      event.target.result.forEach(function(app, i) {

        if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
          return;
        }

        var _path = app.origin;

        if(!app.manifest.icons) {
          return;
        }

        //     launch: function() {
//       if (this.entryPoint) {
//         this.app.launch(this.entryPoint);
//       } else {
//         this.app.launch();
//       }
//     }

        // find the largest icon url.
        var icon = app.manifest.icons['60'] || app.manifest.icons['30'];

        if(!icon) {
          return;
        }

        var url = _path + icon;

        //console.log("icon", url);

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

          var body = Matter.Bodies.rectangle(50+(i%gridWidth)*64, 50+Math.floor(i/gridWidth)*64, s, s, {
            render: {
              sprite: {
                texture: url //"app://email.gaiamobile.org/style/icons/Email_60.png"
              }
            }
          });

          body.app = app;
          //body.app.origin = _path;

          World.addBody(engine.world, body);

        }

      });

    };

  }

  var width = document.body.offsetWidth;
  var height = document.body.offsetHeight;

  var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;

    var engine = Engine.create(document.body, {
      render: {
        options: {
          width: width,
          height: height,
          wireframes: false//,
          // background: 'http://brm.io/matter-js-demo/img/wall-bg.jpg'
        }
      }
    });

    var mouseConstraint = MouseConstraint.create(engine);
    World.add(engine.world, mouseConstraint);

    var mouseConstraint = MouseConstraint.create(engine);
    World.add(engine.world, mouseConstraint);

    // some settings
    var ofs = 30,
        thickness = 100,
        wallOptions = { 
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

    // run the engine
    Engine.run(engine);

  // setTimeout(function() {
    getAllApps();
  // }, 10000);


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

    //console.log(apps);
    //console.log(x);
    //console.log(y);

    for(var i = 0; i < apps.length; i++) {

      var app = apps[i];

      if(x <= app.bounds.max.x && x >= app.bounds.min.x && y <= app.bounds.max.y && y >= app.bounds.min.y) {
        
        //console.log('hit app!');
        //console.log(app);

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


// (function() {

//   // Hidden manifest roles that we do not show
//   var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];

//   // Apps container
//   var parent = document.getElementById('apps');
  
//   // List of all application icons
//   var icons = [];

//   /**
//    * Represents a single app icon on the homepage.
//    */
//   function Icon(app, entryPoint) {
//     this.app = app;
//     this.entryPoint = entryPoint;
//   }

//   Icon.prototype = {

//     get name() {
//       return this.descriptor.name;
//     },

//     get icon() {
//       if (!this.descriptor.icons) {
//         return '';
//       }
//       return this.descriptor.icons['120'];
//     },

//     get descriptor() {
//       if (this.entryPoint) {
//         return this.app.manifest.entry_points[this.entryPoint];
//       }
//       return this.app.manifest;
//     },

//     /**
//      * Renders the icon to the container.
//      */
//     render: function() {
//       if (!this.icon) {
//         return;
//       }

//       // App Icon
//       var tile = document.createElement('div');
//       tile.className = 'tile';
      
//       var dataset = {
//         origin: this.app.origin
//       }
      
//       if (this.entryPoint) {
//         dataset.entryPoint = this.entryPoint;
//       }
      
//       //var iconPath = this.app.origin + this.icon;
      
//       // Temporary icons
//       var iconPath = 'style/icons/Icon_' + this.descriptor.name+ '.png';
      
//       var tile = createTile(iconPath, this.descriptor.name, dataset);
//       parent.appendChild(tile);
//     },

//     /**
//      * Launches the application for this icon.
//      */
//     launch: function() {
//       if (this.entryPoint) {
//         this.app.launch(this.entryPoint);
//       } else {
//         this.app.launch();
//       }
//     }
//   };

//   /**
//    * Creates icons for an app based on hidden roles and entry points.
//    */
//   function makeIcons(app) {
//     if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
//       return;
//     }

//     if (app.manifest.entry_points) {
//       for (var i in app.manifest.entry_points) {
//         icons.push(new Icon(app, i));
//       }
//     } else {
//       icons.push(new Icon(app));
//     }
//   }

//   /**
//    * Returns an icon for an element.
//    * The element should have an entry point and origin in it's dataset.
//    */
//   function getIconByElement(element) {
//     var elEntryPoint = element.dataset.entryPoint;
//     var elOrigin = element.dataset.origin;

//     for (var i = 0, iLen = icons.length; i < iLen; i++) {
//       var icon = icons[i];
//       if (icon.entryPoint === elEntryPoint && icon.app.origin === elOrigin) {
//         return icon;
//       }
//     }
//   }

//   /**
//    * Pinch & zoom design change
//    */
  
//   var gd = new GestureDetector(parent);
//   gd.startDetecting();

//   parent.addEventListener('transform', function(evt) {
//     evt.stopPropagation();
//     evt.target.setCapture(true);
//     var scale = evt.detail.relative.scale;
//     if (scale < 1) {
//       parent.classList.add('small-icons');
//     } else if (scale > 1) {
//       parent.classList.remove('small-icons');
//     }
//   });
  
//   /**
//    * Fetch all apps and render them.
//    */
//   navigator.mozApps.mgmt.getAll().onsuccess = function(event) {

//     event.target.result.forEach(makeIcons);

//     icons.sort(function() {
//       return .5 - Math.random();
//     });

//     icons.forEach(function(icon) {
//       icon.render();
//     });
//   };

//   /**
//    * Add an event listener to launch the app on click.
//    */
//   parent.addEventListener('click', function(e) {
//     var container = e.target
//     if (container.classList.contains('tile')) {
//       var icon = getIconByElement(container);
//       icon.launch();
//     }
//   });

// }());
