/**
	View
	отвечает за отображение игрового поля
**/
var view = {
	/**
	вывод, полученного в артументе, текста в поле вывода.
	**/
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");//получение этого элемента из разметки
		messageArea.innerHTML = msg;	//обновление текста в элементе meaasgeArea
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

/**
	Model
	отвечает за состояние игрового поля.
**/
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	//массив, хранит корабли. 
	ships: [{locations: [0,0,0], hits: ["","",""]},
			 {locations: [0,0,0], hits: ["","",""]},
			 {locations: [0,0,0], hits: ["","",""]}],
	//функция, обработка выстрела, определение попадания или промаха.
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {//перебираем корабли
			var ship = this.ships[i];	//рассмотрение выбранного корабля
			var index = ship.locations.indexOf(guess);	//берем индекс рассматриваемой координаты, из корабля (если она есть)
			if(index >= 0) {	//т.к. ndexOf возвращает -1, если такого индекса нет, то обрабатываем иные значения.
				ship.hits[index] = "hit";	//по полученному индексу записываем в hits значение "hit"
				view.displayHit(guess);	//ставим метку, через View, о том, что в таблицы HTML, будет попадание
				view.displayMessage("HIT!");	// выводим сообщение, в окно сообщений, о попадании.
				if (this.isSunk(ship)) {	//если корабль полностью потоплен
					view.displayMessage("You sank my battleship!");	//если корабль, при попадании, потоплен целиком, то, выводим сообщение об этом.
					this.shipsSunk++;		//добавляем его в счетчик потопленных кораблей
				}
				return true;	//возвращаем true, значит попал
			}
		}
		view.displayMiss(guess);	//записываем в HTML ячейку таблицы, промах
		view.displayMessage("You missed.");	//выводим информацию о промахе.
		return false;		//если ниодна координата не совпала, возвращаем false.
	},
	//функция, для проверки, потоплен ли целиком корабль
	isSunk: function(ship) {	//в аргумент отправляем рассматриваемый корабль
		for (var i = 0; i < this.shipLength; i++) {	//перебираем все индексы в ключе hits
			if(ship.hits[i] !== "hit") {	//если хоть в одном индексе НЕ находим значение hit
				return false;				//возвращаем false - корабль целиком не потоплен.
			}
		}
		return true;						//если все индексы содержат hit, то возвращаем true - корабль потоплен.
	},
	//функция, запуск генератора случайных кораблей
	generateShipLocations: function() {
		var locations;	//все, занятые, координаты кораблей
		for (var i = 0; i < this.numShips; i++) {	//двигаемся по 3 соседним точкам
			do {
				locations = this.generateShip();	//генерируем 3 точки
			} while (this.collision(locations));	//проверяем, перекрывают ли точки, уже сгенерированный корабль
			this.ships[i].locations = locations;	//если да, то генерируем новые 3 точки
		}
	},
	//функция, генерация 3 точек для корабля
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2); // генерируем цифру от 1 до 2 не включая 2. Затем, округляем до целого 0 или 1.
		var row, col;
		
		if(direction === 1) {	//если 1 - то это горизонтальный кор.
			//создать начальную позицию горзонтального корабля.
			row = Math.floor(Math.random() * this.boardSize); //все строки, влюбой может появиться стартовая точка
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength)); //почти все столбцы, оставить место для длины корабля
		} else {	//если 0 - то это вертикальный кор.
			//создать начальную позицию вертикального корабля.
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength)); //почти все строки, оставить место для длины корабля
			col = Math.floor(Math.random() * this.boardSize); //все столбцы
		}
		
		var newShipLocations = [];	//массив позиций дл нового корабля
		for (var i = 0; i < this.shipLength; i++) {	//пробегаемся по 3 точкам
			if (direction === 1) {
				//генерируем 3 точки горизонтального корабля
				newShipLocations.push(row + "" + (col + i)); // в массив накидываем соседние точки в столбцы, не меняя строчку
			} else {
				//генерируем 3 точки вертикального корабля
				newShipLocations.push((row + i) + "" + col); // в массив накидываем соседние точки в строчки, не меняя столбец
			}
		}
		return newShipLocations;	//возвращаем массив, со всеми сгенерированными позициями.
	},
	//функция поиска коллизий, чтобы сгенерированные корабли друг с другом не пересекались.
	//locations - координаты нового корабля
	collision: function(locations) {
		for(var i = 0; i < this.numShips; i++) {	//перебираем размещенные корабли
			var ship = this.ships[i];
			for(var j = 0; j < locations.length; j++) {	//перебираем позиции нового корабля, сравнивая с позициячми рассматриваемого.
				if(ship.locations.indexOf(locations[j]) >= 0) {	//если indexOf вернет индеск искомой позиции (или -1, если такой нет), то значит есть совпадение.
					return true;		//вернется true если перекрытие найдено.
				}
			}
		}
		return false;	//вернется false если перекрытие не найдено.
	}
	
};

/**
	Controller
	guesses Отвечает за количество выстрелов
	processGuess обрабатывает координаты, передает их модели
	Проверяет условие завершения игры.
**/
var controller = {
	guesses: 0,	//количество выстрелов.
	
	//метод проверки правильности ввода.
	parseGuess: function(guess) {
		const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
		
		if (guess === null || guess.length !== 2) {	//длина не более и не менее 2 символов, и не пустота.
			alert("Oops, please enter a letter and a number on the board.");
		} else {
			let firstChar = guess.charAt(0);			//преобразуем введенное, в строку, и берем первый символ
			let row = alphabet.indexOf(firstChar);	//находим такую же букву в массиве ,и записываем ее индекс.
			let column = guess.charAt(1);			//преобразуем введенное, в строку, и берем второй символ
			
			if (isNaN(column)) {	//проверяем, чтобы после преобразования, получились цифры.
				alert("Oops, that isn`t on the board.");
			} else if (row < 0 || row >= model.boardSize ||
						column < 0 || column >= model.boardSize) {
							//проверяем, чтобы полученные цифры были в диапазоне доски от 0 до 6 клеток.
				alert("Oops, that`s off the board!");
			} else {
				return row + column;	//если все ок, возвращаем, преобразованное в 2 цифры
			}
		}
		return null;	//если не ок, то возвращаем null.
	},
	
	processGuess: function(guess) {
		var location = this.parseGuess(guess);	//проверяем введенные данные
		if (model.shipsSunk === model.numShips) {
			view.displayMessage("Game is over");	//игра окончена, вывод сообщения об этом.
		} else if (location) {						//если введенные данные верны, начинаем их обработку
			this.guesses++;					//добавляем +1 к выстрелу в счетчик выстрелов
			var hit = model.fire(location); //обработанные координаты передаются в model.fire
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " +
				this.guesses + " guesses");	//если было попадание, и все корабли потоплены, 
				//выводим сообщение о конце игры, и количестве попыток (выстрелов).
			}
		}
	}
}

/**
Получение координат от формы
и передача их контроллеру.
**/
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");	//ссылка на поле ввода
	var guess = guessInput.value;	//считываем данные из поля ввода
	controller.processGuess(guess);	//считанные координаты передаем в контроллер, для обработки
	
	guessInput.value = "";	// очищаем поле ввода, для сделующего хода.
}

/**
При нажатии Ентер, 
e - аргумент, инормация о нажатой кнопке
**/
function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13) {	//код 13 означает нажатие Enter
		fireButton.click();	//имитируем нажатие кнопки Fire
		return false;		//после обработки, останавливаем функцию.
	}
}

window.onload = init;

function init() {

	var fireButton = document.getElementById("fireButton");	//Присваиваем переменной, ссылку на кнопку.
	fireButton.onclick = handleFireButton;	//назначаем слушатель нажатия onclick, 
							//и вызываем функцию обработки нажатия handleFireButton.
	var guessInput = document.getElementById("guessInput");	//Ссылка на нажатие кнопки клавиатуры
	guessInput.onkeypress = handleKeyPress;					//обработка нажатия кнопки, если это ентер

	model.generateShipLocations();	//запуск процесса генерации кораблей.
}