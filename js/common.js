document.addEventListener("DOMContentLoaded", function() {

});
var currentMenu = null;
var menuPath = [];
var contextMenu = document.getElementById("context-menu");
document.addEventListener("click", function(e) {
	if ( !e.target.classList.contains('disabled') && !e.target.classList.contains('up') && !e.target.classList.contains('down')) {
		var list = document.getElementById("main");
		if( list.style.display == 'none' || !list.style.display ) {
			list.style.display = 'inline-block';
			console.log('height of menu: ', list.offsetHeight);
			console.log('X: ' + e.pageX + ' Y: ' + e.pageY);
			console.log('window height: ', window.innerHeight);
			if(window.innerWidth - e.pageX < list.offsetWidth) {
				console.log('not visible');
				list.style.left = (e.pageX - list.offsetWidth) + 'px';
			} else {
				list.style.left = (e.pageX - 10) + 'px';
			}
			if(window.innerHeight - e.pageY < list.offsetHeight) {
				console.log('not visible bottom');
				list.style.top = (e.pageY - list.offsetHeight) + 'px';
			} else {
				list.style.top = (e.pageY - 25) + 'px';
			}
			
			
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
	var firstItem = currentMenu.getElementsByTagName('li')[1];
	var lastItem = currentMenu.getElementsByTagName('li').length - 2; // get index of last element
	lastItem = currentMenu.getElementsByTagName('li')[lastItem];
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
		Array.prototype.slice.call(currentMenu.getElementsByTagName('li') ).forEach(function(elem){
			if(elem.offsetTop < 0) {
				scrolVal = -elem.offsetTop;
				console.log('offset Top', scrolVal);
			}	
		});

		firstItem.style.marginTop = parseInt(compStyles.marginTop) + scrolVal + 15 + 'px';
		if (firstItem.offsetTop > 0) {
			e.target.parentElement.style.display = 'none';
		}
		if( lastItem.offsetTop + lastItem.offsetHeight > currentMenu.offsetHeight ) {
			currentMenu.getElementsByClassName('down')[0].style.display = 'block';
		}
	}
	if(e.target.classList.contains('down')) {
		console.log('move down');
		var scrolVal = 0;
		Array.prototype.slice.call(currentMenu.getElementsByTagName('li') ).some(function(elem){
			if( elem.offsetTop + elem.offsetHeight > currentMenu.offsetHeight ) {
				console.log('first bottom elem');
				scrolVal = elem.offsetTop + elem.offsetHeight - currentMenu.offsetHeight;
				return true;
			}
		});
		firstItem.style.marginTop = parseInt(compStyles.marginTop) - (scrolVal + 15)  + 'px';
		if( lastItem.offsetTop + lastItem.offsetHeight < currentMenu.offsetHeight) {
			e.target.parentElement.style.display = 'none';
			console.log('end');
		}
		if(firstItem.offsetTop < 0) {
			currentMenu.getElementsByClassName('up')[0].style.display = 'block';
		}
	}
});
contextMenu.addEventListener('mouseover', function(e){
	if(!currentMenu) {
		target = e.target;
		while(target != this) {
			if(target.tagName == 'UL') {
				break;
			} 
			target = target.parentNode;
		}
		currentMenu = target;
		var menuIndex = menuPath.indexOf(currentMenu);

		if( menuIndex > -1 ) {
			for(var i = menuIndex + 1; i < menuPath.length; i++) {
				menuPath[i].style.display = 'none';
				Array.prototype.slice.call(menuPath[i].getElementsByTagName('li') ).forEach(function(elem){
					elem.style.background = 'transparent';
				});
			}
			menuPath.splice(menuIndex + 1);
			
		} else {
			menuPath.push(currentMenu);
		}			
	}
	if( !e.target.classList.contains('disabled') ) {
		var target = e.target;
		while(target != this) {
			if(target.tagName == 'LI') {
				hideMenuWithSub(target.parentElement);
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
						console.log('window width: ', window.innerWidth);
						console.log('submenu width: ', dropList.offsetWidth);
						console.log('offset width: ', currentMenu.offsetWidth);
						if(window.innerWidth < currentMenu.offsetWidth + currentMenu.offsetLeft + dropList.offsetWidth) {
							console.log('ne vlazuTb');
							dropList.style.left = rect.left - rect.width + 'px';
						} else {
							dropList.style.left = rect.left + rect.width + 'px';
						}
						if(window.innerHeight < currentMenu.offsetHeight + currentMenu.offsetTop + dropList.offsetHeight) {
							console.log('ne vlazuTb');
							dropList.style.top = rect.top - dropList.offsetHeight + 'px';
						} else {
							dropList.style.top = (rect.top - 20) + 'px';
						}						
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
	if(!currentMenu) return;
	var relatedTarget = e.relatedTarget;
	var relatedList;
	if(relatedTarget) {
		while(relatedTarget) {
			if(relatedTarget == currentMenu) return;
			if(relatedTarget.tagName == 'UL') relatedList = relatedTarget;
			if(relatedTarget.id == 'context-menu') {
				console.log('move inside menu');
				if (menuPath.indexOf(relatedList) != -1 ) {
					console.log('existing list');
					hideMenuWithSub(currentMenu);
				}
				currentMenu = null;
				return;
			} 
			relatedTarget = relatedTarget.parentNode;
		}
	}
	if(!menuPath) {
		
		hideMenuWithSub(menuPath[menuPath.length - 1]);
	};
	hideMenuWithSub(currentMenu);
	currentMenu = null;
});

function hideMenuWithSub(menu) {
	Array.prototype.slice.call(menu.getElementsByTagName('li') ).forEach(function(el, i) {
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
}
var menuObject = 
'{\
	"item 1": true,\
	"item 2":true,\
	"item 3":true, \
	"item 4": {\
		"L2 item 1":true, \
		"L2 item 2":false,\
		"L2 item 3":true,\
		"L2 item 4":true, \
		"L2 item 5":{\
			"L3 item 1":true, \
			"L3 item 2":false,\
			"L3 item 3":true,\
			"L3 item 4":{\
				"L4 item 1":true, \
				"L4 item 2":false,\
				"L4 item 3":true,\
				"L4 item 4": false\
			},\
			"L3 item 5":false,\
			"L3 item 6":true,\
			"L3 item 7":true\
		},\
		"L2 item 6":true,\
		"L2 item 7":true, \
		"L2 item 8":false,\
		"L2 item 9":true\
	},\
	"item 5": {\
		"L2 item 1":true, \
		"L2 item 2":false,\
		"L2 item 3":true,\
		"L2 item 4":true, \
		"L2 item 5":false,\
		"L2 item 6":true,\
		"L2 item 7":true\
	},\
	"item 6":true,\
	"item 7":true, \
	"item 8": true\
}';


function initMenu(JSONobject) {
	var menu = JSON.parse(JSONobject);
	var elem = document.createElement('ul');
	var container = document.getElementById('context-menu');
	container.innerHTML = '';

	renderMenu(0, 0, menu, container);

	function renderMenu(level, dataNumber, menu, DOMelement) {
		var container = document.createElement('ul');
		var item, arrow;
		var i = 0;
		level++;

		container.setAttribute('data-menu-level', level + '');
		if(level == 1) {
			container.setAttribute('id', 'main');
		}
		container.setAttribute('data-number', dataNumber + '');
		item = document.createElement('li');
		item.setAttribute('class', 'up');
		arrow = document.createElement('span');
		arrow.setAttribute('class', 'up');
		arrow.innerHTML = '&#708;';
		item.appendChild(arrow);
		container.appendChild(item);
		for(var key in menu) {
			item = document.createElement('li');
			item.setAttribute('data-number', i + '');
			item.innerHTML = key + '';

			if( typeof(menu[key]) === 'object' ) {
				renderMenu(level, i, menu[key], DOMelement);
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