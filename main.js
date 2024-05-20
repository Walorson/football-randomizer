const createNewBtn = document.getElementById("create-new"); // Create new Baskets project
const mainMenu = document.querySelector(".main-menu"); // Main menu - choose if create new project or load the project
const sideBtn = document.getElementById("sideButton"); // Button which create a new basket 
const beginBtn = document.getElementById("beginButton"); // Button which begin a row
const final = document.querySelector(".final"); //Final menu of final groups :)
const main = document.querySelector(".main"); //Main menu for create groups :)
const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','W','U','X','Y','Z']; //Alphabet
let finalBaskets = []; //All baskets in one Array :P
let baskets = []; // Array of all baskets
let groups = []; //Tablica zawierająca wszystkie grupy

/////////// If 'Create Button' was clicked, change scene to 'creating baskets' ///////////
createNewBtn.addEventListener("click",() => {
    mainMenu.setAttribute("hidden",";");
    main.style.display = "";
});
/////////////////////////////////////////////////////////////////////////////////////////
const boxes = document.getElementById("boxes"); // Div which contains of box (baskets)

class Basket {
    constructor() {
        this.id = baskets.length+1; 
        this.div = `<div class="box" id="box${this.id}">
        <h3>Koszyk ${this.id}</h3>
        <div id="inputs${this.id}">
        </div>
        <div class="addButton" id="addButton${this.id}">+</div>
        </div>`;
        this.countries = [];
        boxes.innerHTML += this.div;
     
        this.update();
        this.pushCountry();
    }
    update()
    {
        this.box = document.getElementById(`box${this.id}`);
        this.inputs = document.getElementById(`inputs${this.id}`);
        this.button = document.getElementById(`addButton${this.id}`);
        this.button.onclick = () => this.pushCountry();
        this.button.oncontextmenu = (e) => {
            e.preventDefault();
            if(this.countries.length > 1) this.removeCountry();
        }
        this.updateCountries();
    }
    pushCountry(name) {
        this.countries.push(new Country(this.id, this.countries.length+1));   
        this.inputs.innerHTML += this.countries[this.countries.length-1].div;

        if(name != undefined)
            this.countries[this.countries.length-1].inputContent = name;
        else
            this.countries[this.countries.length-1].inputContent = '';

        if(this.countries.length > 7) { this.box.style.overflowY = "scroll"; this.box.scrollTop = this.box.scrollHeight; }
        this.updateCountries();
    }
    updateCountries() {
        this.countries.forEach(item => {
            item.input = document.getElementById(item.id);
            item.input.value = item.inputContent;
            item.input.oninput = () => {
                item.inputContent = item.input.value;
            }
        });
    }
    removeCountry() {
        this.countries[this.countries.length-1].input.remove();
        this.countries.pop();
        this.updateCountries();
    }
}
class Country {
    constructor(boxID, countriesID) {
        this.id = `input${countriesID}box${boxID}`;
        this.div = `<input type="text" id="${this.id}">`;
        this.input = '';
        this.inputContent = '';
    }
}

window.addEventListener("load",() => { 
    baskets.push(new Basket); //Push to baskets array new instance of Basket (new basket will create)
    // Host have special color and placeholder //
    baskets[0].countries[0].input.style.backgroundColor = "#ffc7c7"; //special color
    baskets[0].countries[0].input.setAttribute("placeholder","Host"); //special placeholder
});

sideBtn.addEventListener("click",() => {
    baskets.push(new Basket); //create new basket
    for(let i=0; i<baskets[baskets.length-2].countries.length-1; i++) { /// 
        baskets[baskets.length-1].pushCountry();                        /// Pętla dodaje tyle inputów do koszyka co poprzedni koszyk
    }                                                                   ///
    //// Jeżeli koszyków jest więcej niż 3, zmień tak, aby było wyrównanie do lewej krawędzi                            
    if(baskets.length > 3) {
        boxes.style.justifyContent = 'left';
        boxes.scrollLeft = boxes.scrollWidth;
    }
    //// Pobierz ponownie dla każdego koszyka elementy strony (ze względu na to, że nastąpiła zmiana w strukturze DOM i po prostu tak trzeba, bo inaczej nie działa :/ )
    baskets.forEach(item => item.update());
});

/////// Jeśli prawy przycisk myszy zostanie naciśnięty to usuń ostatni powstały koszyk //////
sideBtn.addEventListener("contextmenu",(e) => {
    e.preventDefault();
    if(baskets.length > 1) {
        baskets[baskets.length-1].box.remove();
        baskets.pop();
    }
});

class Group {
    constructor(letter) {
        this.letter = alphabet[letter];
        this.teams = [];
        this.div = '';
    }
}
////////// Skrypt losowania ////////////////
beginBtn.addEventListener("click",() => {
    ///// Check if length of baskets it's same ////////////
    let valid = true;
    let numberOfGroups = 0; //Liczba grup (później zostanie podana prawidłowa wartość)
    let numberOfTeams = baskets.length; //Liczba drużyn

    baskets.forEach(item => {
        if(item.countries.length != baskets[0].countries.length) valid = false; //Jeśli liczba drużyn jest różna to daj znać, że walidacja się nie powiodła
        else numberOfGroups = item.countries.length;                            //Jeśli zaś wszystko jest OK to przypisz liczbie grup prawidłową wartość
    });
    ///////////////////////////////////////////////////////
    if(valid) {
        //////// Stwórz tablicę wszystkich krajów z koszyka, a potem te tablice włóż do kolejnej tablicy ////////////////
        baskets.forEach(item => {
            let finalCountries = []; //Tablica, która będzie zawierać wszystkie drużyny z koszyka
            
            item.countries.forEach(item2 => {
                finalCountries.push(item2.inputContent); //// Dla każdego Inputu z nazwą kraju wsadzam do FinalCountries nazwę takowego kraju
            });
            
            finalBaskets.push(finalCountries);  //// Do ostatecznej tablicy wsadzam już gotową tablicę z nazwami krajów
        });

        const host = finalBaskets[0][0]; // Wyznaczenie gospodarza turnieju (zawsze znajduję on się w 1. koszyku na 1. pozycji)

        for(let i=0; i<numberOfGroups; i++) {   ////                                  
            groups.push(new Group(i));          //// Stwórz tyle grup ile powinno być, konstruktor przyjmuję 'i', gdyż z 'i' jest przydzielana litera grupy (0 = A, 1 = B, 2 = C ...)
        }                                       ////

        ////// Losowanie bez powtórzeń /////////
        for(let index = 0; index < numberOfTeams; index++)  //// Każda iteracja to kolejny koszyk
        {
            let teams = finalBaskets[index];    //// przechowanie ziterowanego koszyka do zmiennej 'teams'
            
            /////// Będzie to powtórzone tyle razy ile jest grup do momentu aż koszyk nie będzie pusty ///////////
            for(let j=0; j<numberOfGroups; j++) 
            {
                let rand = Math.floor(Math.random()*teams.length);  //// Losuj z przedziału od 0 do ilości drużyn pozostałych w koszyku
                groups[j].teams.push(teams[rand]);                  //// Do aktualnie iterowanej grupy wsadź wylosowaną drużynę

                ///Operacja wyczyszczania wylosowanej drużyny z tablicy////
                /// W skrócie: Usunięcie elementu spowodowuje, że będzie on undefined, więc trzeba przefiltrować tablicę tak, aby usunąć wszystkie undefined /////////
                delete teams[rand];
                let newTeams = [];

                for(let k=0; k < teams.length; k++) {
                    if(teams[k] != undefined) newTeams.push(teams[k]);
                }
                teams = newTeams;
                
                ///////////////////////Koniec losowania////////////////////////
            }
        }
        ///// Ustawienie hosta w pierwszej grupie /////
        if(groups[0].teams[0] != host) // Jeżeli hosta nie ma tam gdzie powinien to zaczynają się jego poszukiwania (szukamy w każdej grupie, czy jest na 1. pozycji)
        {
            const teamFromFirstPlace = groups[0].teams[0];  /// Zapisujemy drużynę z tego miejsca gdzie powinien być gospodarz
            for(let i=1; i<numberOfGroups; i++)     /// Szukamy od grupy B (1), bo już wiemy, że w grupie A go nie ma
            {
                if(groups[i].teams[0] == host) {    /// Jeśli host tam się znajduje to na jego miejsce wskakuje wcześniej zapisana drużyna, która zajęła miejsce hosta
                    groups[i].teams[0] = teamFromFirstPlace; /// o właśnie tu zachodzi ta zamiana
                    break;                                   /// Urwanie pętli, bo przecież już znaleźliśmy gospodarza
                }
            }
            groups[0].teams[0] = host;  //// Zapisanie w miejscu gospodarza - gospodarza
        }
        ///// Utworzenie interfejsów graficznych dla grup /////
        groups.forEach((item, index) => {
            let teamsInGroup = '';
            for(let i=0; i<item.teams.length; i++) {
                teamsInGroup += `<p>${item.teams[i]}</p>\n`;
            }
            item.div = `
                <div class="group">
                <h1>GROUP ${alphabet[index]}</h1>
                <div class="teams">
                    ${teamsInGroup}
                </div>
                </div>
            `
        });
        ///// Wyświetlenie grup na ekranie - pozdro /////
        main.style.display = 'none';
        final.style.display = '';

        groups.forEach(item => {
            final.innerHTML += item.div;
        });
        
        console.log(host);
        console.log(groups);

        beginBtn.style.display = "none"; //schowaj przycisk
    }
    else alert("Liczba drużyn w każdych koszykach musi być taka sama!");
});