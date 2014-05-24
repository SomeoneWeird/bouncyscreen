var createTile = function(icon, name, dataset) {
  var tile = document.createElement('div');
  tile.className = 'tile';
  
  for (var el in dataset) {
    tile.dataset[el] = dataset[el];
  }
  
  if (dataset.notifications) {
    var notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = dataset.notifications;
    tile.appendChild(notification);
  }

  tile.style.backgroundImage = 'url(' + icon + ')';
  
  // App Label
  var label = document.createElement('span');
  label.classList.add('app-label');
  label.innerHTML = name;
  
  tile.appendChild(label);
  
  return tile;
}