var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];


(function() {

  function getAllApps() {

    navigator.mozApps.mgmt.getAll().onsuccess = function(event) {

      // console.log(event.target.result);

      for(var i = 0; i < event.target.result.length; i++) {

        var app = event.target.result[i];

        if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
          continue;
        }

        var _path = app.origin;

        if(!app.manifest.icons) {
          continue;
        }

        var icon = app.manifest.icons['30'] || app.manifest.icons['60'] || app.manifest.icons['120'];

        var size;

        for(var s in app.manifest.icons) {
          if(app.manifest.icons[icon] == icon) {
            size = parseInt(s);
          }
        }

        if(!icon) {
          continue;
        }

        var url = _path += icon;

        (function(url,i){

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

            var body = Matter.Bodies.rectangle(50+(i%8)*s, 50+Math.floor(i/8)*s, s, s, {
              render: {
                sprite: {
                  texture: url //"app://email.gaiamobile.org/style/icons/Email_60.png"
                }
              }
            });

            World.addBody(engine.world, body);

          }

        })(url,i);

      }

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
    MouseConstraint = Matter.MouseConstraint;

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
    var ofs = 10,
        thickness = 50,
        wallOptions = { 
          isStatic: true,
          render: {
            visible: true
          }
        };

    var cx = Math.floor(width/2);
    var cy = Math.floor(height/2);

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
