document.addEventListener("DOMContentLoaded", function() {

});
var currentMunu = null;
var menuPath = [];
var contextMenu = document.getElementById("context-menu");
document.addEventListener("click", function(e) {
	if ( !e.target.classList.contains('disabled') && !e.target.classList.contains('up') && !e.target.classList.contains('down')) {
		var list = document.getElementById("main");
		if( list.style.display == 'none' || !list.style.display ) {
			list.style.display = 'inline-block';
			list.style.top = (e.pageY - 25) + 'px';
			list.style.left = (e.pageX - 10) + 'px';
			menuPath.push(list);
		} else {
			Array.prototype.slice.call( contextMenu.getElementsByTagName('UL') ).forEach(function(elem){
				if( elem.hasAttribute('data-menu-level') ) {
					elem.style.display = 'none';
					Array.prototype.slice.call(elem.getElementsByTagName('li') ).forEach(function(el){
						el.style.background = 'transparent';
					});
				}
			});
			menuPath = [];
		}
	}
});
contextMenu.addEventListener('click', function(e) {
	var firstItem = currentMunu.getElementsByTagName('li')[1];
	var lastItem = currentMunu.getElementsByTagName('li').length - 2; // get index of last element
	lastItem = currentMunu.getElementsByTagName('li')[lastItem];
	var compStyles = getComputedStyle(firstItem);

	if (e.target.classList.contains('disabled')) {
		return;
	}
	if( e.target.tagName == 'LI' ) {
		console.log('li contains', e.target.firstChild.nodeValue);
	} 
	if(e.target.classList.contains('up')) {
		console.log('move up');
		var scrolVal = 0;
		Array.prototype.slice.call(currentMunu.getElementsByTagName('li') ).forEach(function(elem){
			if(elem.offsetTop < 0) {
				scrolVal = -elem.offsetTop;
				console.log('offset Top', scrolVal);
			}	
		});

		firstItem.style.marginTop = parseInt(compStyles.marginTop) + scrolVal + 15 + 'px';
		if (firstItem.offsetTop > 0) {
			e.target.parentElement.style.display = 'none';
		}
		if( lastItem.offsetTop + lastItem.offsetHeight > currentMunu.offsetHeight ) {
			currentMunu.getElementsByClassName('down')[0].style.display = 'block';
		}
	}
	if(e.target.classList.contains('down')) {
		console.log('move down');
		var scrolVal = 0;
		Array.prototype.slice.call(currentMunu.getElementsByTagName('li') ).some(function(elem){
			if( elem.offsetTop + elem.offsetHeight > currentMunu.offsetHeight ) {
				console.log('first bottom elem');
				scrolVal = elem.offsetTop + elem.offsetHeight - currentMunu.offsetHeight;
				return true;
			}
		});
		firstItem.style.marginTop = parseInt(compStyles.marginTop) - (scrolVal + 15)  + 'px';
		if( lastItem.offsetTop + lastItem.offsetHeight < currentMunu.offsetHeight) {
			e.target.parentElement.style.display = 'none';
			console.log('end');
		}
		if(firstItem.offsetTop < 0) {
			currentMunu.getElementsByClassName('up')[0].style.display = 'block';
		}
	}
});
contextMenu.addEventListener('mouseover', function(e){
	if(!currentMunu) {
		target = e.target;
		while(target != this) {
			if(target.tagName == 'UL') {
				break;
			} 
			target = target.parentNode;
		}
		currentMunu = target;
		var menuIndex = menuPath.indexOf(currentMunu);

		if( menuIndex > -1 ) {
			for(var i = menuIndex + 1; i < menuPath.length; i++) {
				menuPath[i].style.display = 'none';
				Array.prototype.slice.call(menuPath[i].getElementsByTagName('li') ).forEach(function(elem){
					elem.style.background = 'transparent';
				});
			}
			menuPath.splice(menuIndex + 1);
			
		} else {
			menuPath.push(currentMunu);
		}			
	}
	if( !e.target.classList.contains('disabled') ) {
		var target = e.target;
		while(target != this) {
			if(target.tagName == 'LI') {
				var items = Array.prototype.slice.call( target.parentElement.getElementsByTagName('li') );
				items.forEach(function(el, i) {
					el.style.background = 'transparent';
					if( el.getElementsByClassName('arrow')[0] ) {
						Array.prototype.slice.call( contextMenu.getElementsByTagName('ul') ).forEach(function(elem){
							if( +elem.getAttribute('data-number') == +el.getAttribute('data-number') 
								&& +elem.getAttribute('data-menu-level') == +el.parentElement.getAttribute('data-menu-level') + 1 ) {
							elem.style.display = 'none';
							}
						});
					}
				});
				target.style.background = '#26ece3'; 
				// Show submenu
				if(target.getElementsByClassName('arrow')[0] ) {
					var dropList;

					var targetID = +target.getAttribute('data-number');
					var targetLevel = +target.parentElement.getAttribute('data-menu-level');
					Array.prototype.slice.call( contextMenu.getElementsByTagName('ul') ).forEach(function(elem){
						if( +elem.getAttribute('data-number') == targetID && +elem.getAttribute('data-menu-level') == targetLevel + 1 ) {
							dropList = elem;
						}
					});
					if(dropList) {
						var rect = target.getBoundingClientRect();
						dropList.style.display = 'block';
						dropList.style.top = (rect.top - 20) + 'px';
						dropList.style.left = rect.left + rect.width + 'px';
					}
				}
				target = null;				
				break;
			}
			target = target.parentNode;
		}
		target = null;
	}

});

document.getElementById("context-menu").addEventListener('mouseout', function(e) {
	if(!currentMunu) return;
	var relatedTarget = e.relatedTarget;
	if(relatedTarget) {
		while(relatedTarget) {
			if(relatedTarget == currentMunu) return;
			if(relatedTarget.id == 'context-menu') {
				console.log('move inside menu');
				currentMunu = null;
				return;
			};
			relatedTarget = relatedTarget.parentNode;
		}
	}
	if(!menuPath) {
		Array.prototype.slice.call(menuPath[menuPath.length - 1].getElementsByTagName('li') ).forEach(function(el, i) {
			el.style.background = 'transparent';
			if( el.getElementsByClassName('arrow')[0] ) {
				Array.prototype.slice.call( contextMenu.getElementsByTagName('ul') ).forEach(function(elem){
					if( +elem.getAttribute('data-number') == +el.getAttribute('data-number') 
						&& +elem.getAttribute('data-menu-level') == +el.parentElement.getAttribute('data-menu-level') + 1 ) {
						elem.style.display = 'none';
					}
				});
			}
		});		
	};
	currentMunu = null;
});

var menuObject = '{"item 1": true,"item 2":true,"item3":true, "item 4": {"b item 1":true, "b item 2":false,"b item 3":true}}';


function initMenu(JSONobject) {
	var menu = JSON.parse(JSONobject);
	var elem = document.createElement('ul');
	var container = document.getElementById('context-menu');
	container.innerHTML = '';
	console.log(menu);


	renderMenu(1, 0, menu, container);

	function renderMenu(level, dataNumber, menu, DOMelement) {
		var container = document.createElement('ul');
		var item, arrow;
		var i = 0;

		container.setAttribute('data-menu-level', level + '');
		container.setAttribute('data-number', dataNumber + '');
		if(level == 1) {
			container.setAttribute('id', 'main');
		}
		item = document.createElement('li');
		item.setAttribute('class', 'up');
		arrow = document.createElement('span');
		arrow.setAttribute('class', 'up');
		arrow.innerHTML = '&#708;';
		item.appendChild(arrow);
		container.appendChild(item);
		for(var key in menu) {
			console.log('level ' + level + ' item: ' + key);
			item = document.createElement('li');
			item.setAttribute('data-number', i + '');
			item.innerHTML = key + '';

			if( typeof(menu[key]) === 'object' ) {
				renderMenu(++level, i, menu[key], DOMelement);
				arrow = document.createElement('span');
				arrow.setAttribute('class', 'arrow');
				arrow.innerHTML = '&#9658;';
				item.appendChild(arrow);
			}
			container.appendChild(item);		
			i++;
		}
		item = document.createElement('li');
		item.setAttribute('class', 'down');
		arrow = document.createElement('span');
		arrow.setAttribute('class', 'down');
		arrow.innerHTML = '&#709;';
		item.appendChild(arrow);
		container.appendChild(item);
		DOMelement.appendChild(container);
	}
}

initMenu(menuObject);