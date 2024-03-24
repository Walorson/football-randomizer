const loadJSON = document.getElementById("loadJSON");
const saveJSON = document.getElementById("saveJSON");
let saveCSV = document.getElementById("saveCSV");
let json;

/////////////// IMPORT FILE ////////////////
loadJSON.addEventListener("click",() => {
    json = JSON.parse(loadWindow.textarea.value);
    
    for(let i=0; i<json.Baskets.length; i++) {

        if(i != 0) {
            baskets.push(new Basket);
            
        }

        for(let j=0; j<json.Baskets[i].length; j++) {
        
            if(j == 0) baskets[i].countries[0].inputContent = json.Baskets[i][0];
            if(j > json.Baskets[i].length-2) continue;
            baskets[i].pushCountry(json.Baskets[i][j+1]);
        }
    }

    baskets.forEach(item => item.update());

    mainMenu.setAttribute("hidden",";");
    main.style.display = "";

    loadWindow.close();
});

///////////////// SAVE FILE /////////////////
saveJSON.addEventListener("click",() => {
    let json = `{
    "Baskets": [\n`;
    for(let i=0; i<baskets.length; i++) {
        let content = '         [';

        baskets[i].countries.forEach(item => {
            content += `"${item.inputContent}",`;
        });
        content = content.replaceAt(content.length-1, "]");
        content += ",\n";

        json += content;
    }
    json = json.replaceAt(json.length-2, "");
    json += "   ]\n}";
    
    let jsonFile = new Blob([json],{ type: "text/plain;charset=utf-8" });
    saveAs(jsonFile, "baskets-save.json");
});

String.prototype.replaceAt = function(position, character) {
    return this.slice(0,position) + character + this.slice(position+1, this.length);
}

///////////////EXPORT TO .CSV////////////////
beginBtn.addEventListener("click",() => {
    saveCSV = document.getElementById("saveCSV");

    saveCSV.onclick = () => {
        let csv = "";
        for(let i=0; i<groups[0].teams.length; i++) {
            for(let j=0; j<groups.length; j++) {
                csv += groups[j].teams[i]+";"
            }
            csv += "\n";
        }
        let csvFile = new Blob([csv],{type: "text/plain;charset=utf-8-bom"});
        saveAs(csvFile,"teams.csv");
    }
});