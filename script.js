
// вызываем функцию для загрузки сегодняшней даты
addEventListener("load", currentDate);
// вызываем функцию для показа сохраненных дат в localStorage
addEventListener("load", showSavedDate);

const inputDate = document.getElementById('date');


//переменная для хранения информации о курсах валют на сегодня
let data; 


//функция для запроса информации о курсах валют на сегодня
function requestForData(callback){   
// Создаем новый объект XMLHttpRequest
    let xhr = new XMLHttpRequest();    
// Определяем адрес запроса с параметрами
    let url =  "https://api.nbrb.by/exrates/rates?periodicity=0";  
// Открываем соединение с методом GET и указанным адресом
    xhr.open("GET", url);  
// Определяем функцию, которая будет вызвана при получении ответа от сервера
    xhr.onload = function() {   
// Проверяем статус ответа
        if (xhr.status == 200) {     
// Преобразуем ответ в JSON-формат
        data = JSON.parse(xhr.responseText);  
// Вызываем функцию обратного вызова с аргументом data
        callback(data);                         
    } 
    else {
// Выводим ошибку в консоль
        console.error(xhr.statusText);          
    }
    };
// Отправляем запрос
    xhr.send();                             
    return data;
}


//переменнные для хранения информации о курсе валют на сегодня (для каждой валюты)
let usdRate;
let euroRate;
let rubRate;

//функция присваивания переменным значений курсов валют на сегодня  
function assinmentRate(data){
   for(let i=0; i <data.length; i++){
        if(data[i].Cur_Abbreviation == 'USD'){usdRate = data[i].Cur_OfficialRate};
        if(data[i].Cur_Abbreviation == 'RUB'){rubRate = data[i].Cur_OfficialRate/100};
        if(data[i].Cur_Abbreviation == 'EUR'){euroRate = data[i].Cur_OfficialRate};
    }
  return [usdRate, rubRate, euroRate];
};

//вызываем функцию получения данных с сайат НБРБ
requestForData(assinmentRate);  

//получаем доступ к кнопке "ввод курсов"
let buttonCourses = document.querySelector("#buttonCourses");
buttonCourses.addEventListener("click", showExchangeRate);

//показываем курсы валют по нажатию на кнопку "Ввод курсов"
function showExchangeRate(){
//если у кнопки нет этих классов, значит дата выбрана не сегодняшняя - прекращаем выполнение функции
    if(buttonCourses.className !== "active" && buttonCourses.className !== "activated" ){return};
//если класс "active" убираем его и прсваиваем класс "activated"
    if(buttonCourses.classList == "active"){
        buttonCourses.classList.remove("active");
        buttonCourses.classList.add("activated");
// создаем элемент в который запишем информацию о курсах
    const item = document.createElement("textarea");
	item.textContent = `USD = ${usdRate.toFixed(2)} EUR = ${euroRate.toFixed(2)} RUB = ${rubRate.toFixed(2)}`;
    item.classList = "forButtonCourses";
	buttonCourses.insertAdjacentElement("afterEnd",item);
    }
// если у кнопки класс "activated", то при клике заменим на класс "active", т.к возможно
// не нужен курс на сегодня, но в сегодняшнюю дату нужно произвести конвертацию по собственному курсу
    else{
        if(buttonCourses.classList == "activated")
        buttonCourses.classList.remove("activated");
        buttonCourses.classList.add("active");
// убираем поле с курсами
        const item = document.querySelector("textarea");
        item.remove();
    }
}


// функция устанавливает сегодняшнюю дату
function currentDate(){
    const inputDate = document.getElementById('date');
    let today = new Date();
    let year = today.getFullYear ();
// отсчет месяцев от 0, поэтому добавляем единицу
    let month = today.getMonth () + 1; 
    let day = today.getDate ();
    if (month < 10) {
// добавляем ведущий ноль
        month = '0' + month; 
    }
    if (day < 10) {
// добавляем ведущий ноль
        day = '0' + day; 
    }
// используем формат yyyy-mm-dd
    let todaysDate = `${year}-${month}-${day}`; 
// присваиваем значение свойству value
    inputDate.value = todaysDate; 
    const buttonCourses = document.querySelector("#buttonCourses");
    buttonCourses.classList = "active";
};


//функция, очищающая все поля при смене даты
function changeDate(){
    const buttonCourses = document.querySelector("button");
    buttonCourses.classList.remove("activated");
   // const inputDate = document.getElementById('date');
//получаем все инпуты
    const allInputs = document.querySelectorAll("input");
    let arrOfInputs = [...allInputs];
// убираем из массива инпут с датой
    arrOfInputs.shift(arrOfInputs[0]);
    arrOfInputs.forEach(function(elem){elem.value = "";})
// получаем доступ к полям ИТОГО
    let totalStr = document.querySelectorAll(".total_byn>span");
    let totalItogo = document.querySelector("#total>span");

    let arrOfTotalStr = [...totalStr];
    arrOfTotalStr.forEach(function(elem){elem.textContent = "";})

    totalStr.textContent = "";
    totalItogo.textContent = "";
// убираем поле с информацией о курсах на сегодня
    const item = document.querySelector("textarea");
    if(item !== null)
        {item.remove();}
    returnTotal();
    return;
}


inputDate.addEventListener("change", disactivateButton);

//функция, убирающая с кнопки "ввод курсов" класс "active"
function disactivateButton(){
    const inputDate = document.getElementById('date');
    const buttonCourses = document.querySelector("button");

    let today = new Date();
    let year = today.getFullYear ();
// отсчет месяцев от 0, поэтому добавляем единицу
    let month = today.getMonth () + 1; 
    let day = today.getDate ();
    if (month < 10) {
// добавляем ведущий ноль
        month = '0' + month; 
    }
    if (day < 10) {
// добавляем ведущий ноль
        day = '0' + day; 
    }
    let todaysDate = `${year}-${month}-${day}`;

    if (inputDate.value !== todaysDate) {
// Удаляем определенный класс с кнопки 
        buttonCourses.classList.remove("active");}
    else {buttonCourses.classList = "active"};
};


//добавить новую строку для расчета
const plus = document.querySelector("#plus");
plus.addEventListener("click", addFieldset);
let count = 0;
// получаем доступ к существующему "fieldset"
let firstFieldset = document.querySelector("fieldset");

function addFieldset(){
//  разрешаем клонирование существующего "fieldset"
    const newFieldset = firstFieldset.cloneNode(true);
        
    let summa = newFieldset.querySelector(".summa");
    summa.value = "";

    let typeOfCurrency = newFieldset.querySelector(".currency");
    typeOfCurrency.value = "";

    let exchangeRate = newFieldset.querySelector(".exchange_rate");
    exchangeRate.value = "";

    let totalByn = newFieldset.querySelector("fieldset>div>span");
    totalByn.textContent = "";
    parseInt(totalByn.textContent);
    firstFieldset.parentElement.appendChild(newFieldset);
  
// пересчитываем общую сумму ИТОГО после добавления новой строки
    totalSumma();
    let buttonsConvert = document.querySelectorAll("#total>button");
    let arr = [];
    arr = [...buttonsConvert].slice(0,3);
    arr.forEach((elem)=> elem.classList.remove("active"));
// так как сумма пересчитывается в BYN, делаем активной кнопку BYN
    let bynButton = document.querySelector("#byn");
    bynButton.classList.add("active");
};




//удалить строку расчета
let cross = document.querySelector("fieldset>p"); 

function delFieldset(cross){
//проверяем сколько строк в теле программы
    let arrOfFieldsetscross = document.querySelectorAll("fieldset>p"); 
//если только одна - ничего не удаляем
    if(arrOfFieldsetscross.length == 1){return}; 
//находим родительский fieldset
    let fieldset = cross.closest("fieldset"); 
    
    let confirmationDel = confirm("Вы уверены, что хотите удалить текущую строку?");
    if(confirmationDel){
            cross.closest("fieldset").remove();}
//вызываем функцию, чтобы узнать общую сумму после удаления строки           
    totalSumma();  

//получаем доступ к общему ИТОГО
    let total = document.querySelector("#total>span"); 
    let totalValue = parseFloat(total.textContent);
//узнаем какая кнопка конвертации активна
    let activeButton = whatButtonIsActive(); 
    let arrActiveButton = [...activeButton];
//в зависимости от активной кнопки пересчитываем сумму в окне ИТОГО
    if(arrActiveButton[0].id == "usd"){return total.textContent = `${(totalValue /usdRate).toFixed(2)}`}; 
    if(arrActiveButton[0].id == "euro"){return total.textContent = `${(totalValue /euroRate).toFixed(2)}`};
    return;  
};


//пересчет в бел руб в каждой строке
function convertToByn(input){
//находим родительский fieldset
    let fieldset = input.closest("fieldset"); 
    let sum = fieldset.querySelector(".summa");
    let summa = sum.value;
    parseFloat(summa).toFixed(2);

    let type_of_currency = fieldset.querySelector(".currency");
  

    let exchangeRate = fieldset.querySelector(".exchange_rate");
    const buttonCourses = document.querySelector("button");
//проверяем нажата ли кнопка "ввод курсов", если да - то применяем курсы по НБРБ на сегодня
    if(buttonCourses.classList == "activated")
        {if(type_of_currency.value == "USD"){exchangeRate.value = usdRate.toFixed(2) }
        if(type_of_currency.value == "EUR"){exchangeRate.value = euroRate.toFixed(2) }
        if(type_of_currency.value == "RUB"){exchangeRate.value = rubRate.toFixed(2)}};


    let totalByn = fieldset.querySelector(".total_byn>span");
    parseFloat(totalByn.textContent).toFixed(2);
//если сумма перевода или курс не введены - возврат
    if (summa == "" || exchangeRate.value == "") {
        totalByn.textContent = ``;
        return;
    }

    totalByn.textContent = `${(summa * exchangeRate.value).toFixed(2)}`;
//вызываем функцию пересчета общего ИТОГО всех строк. после изменения данных в строке
    totalSumma();
};

  
//считаем ИТОГО всех строк
function totalSumma(){
//поле для вывода результата
    let total = document.querySelector("#total>span"); 
//все поля из которых нужно взять суммы
    let totalBynAll = document.querySelectorAll(".total_byn>span"); 
    let arrOfTotalBynAll = [];
    for(let i=0; i<totalBynAll.length; i++){
//если после пустое - присваиваем ему значение 0
        if(totalBynAll[i].textContent == ""){    
            totalBynAll[i].textContent = 0;
        }
        arrOfTotalBynAll.push(totalBynAll[i].textContent);
    };
    let summa = 0;
    arrOfTotalBynAll.forEach(function(elem){summa += parseFloat(elem); return summa});
    total.textContent = `${summa.toFixed(2)}`;

    return (total.textContent);
};

//расчет итоговой суммы в долл и евро по нажатию кнопки
    const usd = document.querySelector("#usd");
    const euro = document.querySelector("#euro");
    const byn = document.querySelector("#byn");

    byn.addEventListener("click", convertByButtonToByn);
    euro.addEventListener("click", convertByButtonToEuro);
    usd.addEventListener("click", convertByButtonToUsd);


//функция для определения активной кнопки конвертера
function whatButtonIsActive(){
    let buttonsConvert = document.querySelectorAll("#total>button");
    let arr = [];
// убираем из массива кнопку "запомнить"
    arr = [...buttonsConvert].slice(0,3);
// возвращаем элемент с классом "active"   
    const arr1 =  arr.filter((elem)=> elem.className == "active");
    return arr1;
}
    
//функция активации кнопки и пересчет итогового поля в выбранной валюте
function convertByButtonToByn(){
// находим аткивную кнопку и убираем класс "active"
    let activeButton = whatButtonIsActive();    
    activeButton[0].classList.remove("active");
    byn.classList = "active";

    let total = document.querySelector("#total>span");
    let summa = totalSumma();
    parseFloat(summa);
    total.textContent = `${summa}`;
};
    



function convertByButtonToUsd(){
    let activeButton = whatButtonIsActive();    
    activeButton[0].classList.remove("active");
    
    usd.classList = "active";
    let total = document.querySelector("#total>span");
    let summa = totalSumma();
    const buttonCourses = document.querySelector("#buttonCourses");
// если кнопка "ввод курсов" не активирована, тогда предлагаем ввести свой курс для конвертации
    if(buttonCourses.className !== "activated")
        {let whatRate =prompt("Введите курс валюты (при нажатии \"отмена\" будет взять курс по НБРБ на сегодня)");
// если нажали "отмена", берем курс по НБРБ на сегодня
        if(whatRate === null)
            {total.textContent = `${(summa/usdRate).toFixed(2)}`;}
        else {total.textContent = `${(summa/whatRate).toFixed(2)}`};
        }
// если кнопка "ввод курсов" активирована, считаем по НБРБ на сегодня
    else {total.textContent = `${(summa/usdRate).toFixed(2)}`;}
};


function convertByButtonToEuro(){
    let activeButton = whatButtonIsActive();    
    activeButton[0].classList.remove("active");
    euro.classList = "active";
    let total = document.querySelector("#total>span");
    let summa = totalSumma();
    parseFloat(summa).toFixed(2);
    const buttonCourses = document.querySelector("#buttonCourses");
    if(buttonCourses.className !== "activated")
        {let whatRate =prompt("Введите курс валюты (при нажатии \"отмена\" будет взять курс по НБРБ на сегодня)");
        if(whatRate === null)
                {total.textContent = `${(summa/euroRate).toFixed(2)}`;}
        else {total.textContent = `${(summa/whatRate).toFixed(2)}`};
        }
    else {total.textContent = `${(summa/euroRate).toFixed(2)}`;}
};


//сохраняем инфо о предыдущ расчетах в localStorage
function save(){
   
    let date = document.querySelector("#date").value;
    let fieldSumma =[]; 
    document.querySelectorAll(".summa").forEach(function (el){
        fieldSumma.push(el.value);
    });

    let fieldCurrency = [];
    document.querySelectorAll(".currency").forEach(function (el){
        fieldCurrency.push(el.value);
    });

    let fieldExchangeRate = [];
    document.querySelectorAll(".exchange_rate").forEach(function (el){
        fieldExchangeRate.push(el.value);
    });

    let fieldTotalInByn = [];
    document.querySelectorAll(".total_byn>span").forEach(function (el){
        fieldTotalInByn.push(el.textContent);
    });

    let bigTotal = document.querySelector("#total>span").textContent;

    //создаем объект для хранения информации о предыдущих расчетах
    const fieldsetObj = {
        summa: [...fieldSumma],
        currency: [...fieldCurrency],
        exchange: [...fieldExchangeRate],
        total: [...fieldTotalInByn],
        bigTot: bigTotal
    };
    
    //добавляем объект в localStorage
    localStorage.setItem(date, JSON.stringify(fieldsetObj));

    //проверяем есть ли у нас блок с сохраненными датами
    let savedDate = document.querySelector("#save+p");
    //если нет - создаем
    if(savedDate == undefined)
        {let saveButton = document.querySelector("#save");
        const item = document.createElement("p");
	    item.textContent = `${date} `;
        item.classList = "saveButton";
	    saveButton.insertAdjacentElement("afterEnd",item);
    }
    //если есть - добавляем новую дату в существующее поле
    else {
        const textareaPresent = document.querySelector("#save+p");
        textareaPresent.append(`${date} `);
    }
    };



function returnTotal(){
    let selectedDate = document.querySelector("#date").value;
    if(localStorage.getItem(selectedDate) == null){return}
    else 
        {let savedFields = JSON.parse(localStorage.getItem(selectedDate)); 
        let summas = savedFields.summa;
        let whatLengthCreat = summas.length;

        if(whatLengthCreat>1){
            let presentField = document.querySelector("fieldset");
            const newFieldset = firstFieldset.cloneNode(true);
            for(let i=1; i<whatLengthCreat; i++){
                presentField.parentElement.appendChild(newFieldset);
            }
        };
        let fieldSumma = document.querySelectorAll(".summa");

        let fieldCurrency = document.querySelectorAll(".currency");
        
        let fieldExchangeRate = document.querySelectorAll(".exchange_rate");
        
        let fieldTotalInByn = document.querySelectorAll(".total_byn>span");

        let bigTotal = document.querySelector("#total>span");

        for(i=0; i<whatLengthCreat; i++){
            fieldSumma[i].value = savedFields.summa[i];
            fieldCurrency[i].value = savedFields.currency[i];
            fieldExchangeRate[i].value = savedFields.exchange[i];
            fieldTotalInByn[i].textContent = savedFields.total[i];
        }
        bigTotal.textContent = savedFields.bigTot;}
}

//функция для показа всех дат, в которых были сохранения общей суммы
function showSavedDate(){
    let saveButton = document.querySelector("#save");
// проверяем есть ли что-то в localStorage
    if(localStorage.length > 0){
        let arr = Object.keys(localStorage);
        const item = document.createElement("p");
        saveButton.insertAdjacentElement("afterEnd",item);
        item.classList = "saveButton";
// выводим все что есть в localStorage
        arr.forEach(function(elem){item.append(`${elem} `)})
    }
}







