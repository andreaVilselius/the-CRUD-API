# 📌 Rättningsrapport – fed25s-the-crud-api-andreaVilselius

## 🎯 Uppgiftens Krav:
# Inlämningsuppgift CRUD-api

I denna uppgift skall ni skapa ett api som tillhandahåller CRUD-operationer för en webshop.

## API:t

Api:t skall skapas med node.js och använda express. Routes och controllers skall finnas enligt god standard.
Varje route behöver returnera korrekt status och data.

## Client

För att kunna se någonting är det bra om ni skapar ett mycket enkelt frontend-projekt med syfte att kunna använda ert api. Ni får välja teknik helt själva här. Men en rekommendation är att använda vad ni har med för kunskaper och inte hoppa på någonting nytt. 

## Betyg G

- Ett api med node.js och express
- Routes och controllers är på plats
- Koppling med mongodb fungerar
- Endpoints för alla CRUD-operationer
- En modell för att hantera produkter. Som minst behöver en produkt ha egenskaperna:
  - Id
  - Namn
  - Pris

## Betyg VG

- Samtliga punkter för G
- Sortering på serversidan, både av produkter och ordrar
- Sökning på serversidan, både av produkter och ordrar
- En modell för ordrar:
  - En order innehåller information om en order (såsom kundinformation, datum, et.c.)
  - En order innehåller en lista med objekt. Dessa objekt beskriver vilken produkt som finns i varukorgen och hur många av den det finns
- Mycket liten frontend som gör anrop

## Vid rättning

- Ta hänsyn till mappstrukturer. Det finns studenter som har skapat mappar för backend respektive frontend. 
- Ta hänsyn till komplexa modeller, t.ex. där pris finns i en variant av en produkt. 

## 🔍 ESLint-varningar:
- /app/repos/fed25s-the-crud-api-andreaVilselius/FrontEnd/src/HTMLutils/HTMLutil.ts - no-console - Unexpected console statement.,no-console - Unexpected console statement.
- /app/repos/fed25s-the-crud-api-andreaVilselius/FrontEnd/src/main.ts - no-console - Unexpected console statement.,no-console - Unexpected console statement.
- /app/repos/fed25s-the-crud-api-andreaVilselius/FrontEnd/src/services/orderService.ts - no-console - Unexpected console statement.,no-console - Unexpected console statement.,no-console - Unexpected console statement.,no-console - Unexpected console statement.,no-console - Unexpected console statement.,no-unused-vars - 'error' is defined but never used.,@typescript-eslint/no-unused-vars - 'error' is defined but never used.,no-unused-vars - 'error' is defined but never used.,@typescript-eslint/no-unused-vars - 'error' is defined but never used.

## 🏆 **Betyg: G**
📌 **Motivering:** Projektet uppfyller G-kraven: ni har ett Node.js + Express-API med tydlig uppdelning i routes och controllers, fungerande MongoDB-koppling via mongoose, samt endpoints för CRUD på ordrar (GET/POST/PUT/DELETE). Det finns också en produktmodell med minst id, name och price, och ordrar innehåller kundinfo samt en lista med orderItems (produkt + antal), vilket ligger i linje med uppgiften.

Ni har dessutom implementerat sökning och sortering på serversidan för både ordrar och produkter i en order, samt en mycket liten frontend som gör anrop—vilket i sak matchar VG-kraven. Däremot finns flera konkreta korrekthets- och kvalitetsproblem som gör att helheten inte känns tillräckligt robust för att sätta VG utan tvekan: (1) en tydlig typ-inkonsekvens i Backend/src/models/types.mts där Order använder fältet "adress" medan resten av systemet använder "address", vilket riskerar att uppdateringar tappar/skriv fel fält, (2) updateOrder använder findOneAndUpdate men returnerar sannolikt gammalt dokument (default i mongoose) och anropar dessutom save() efter en query-uppdatering, vilket är en osäker/oklar strategi, (3) removeOneProductFromOrder saknar await på save(), vilket kan ge race conditions, och (4) vissa statuskoder är inkonsekventa (t.ex. 400 där 404 vore mer korrekt när resurs saknas). Sammantaget: funktionaliteten finns, men de här buggarna/oklarheterna drar ner tillförlitligheten, så betyget landar på G.

💡 **Förbättringsförslag:**  
1) Fixa datamodell/typer (viktigast)
- Rätta Backend/src/models/types.mts: byt "adress" -> "address" så att typer, schema och controllers använder samma fältnamn. Detta är en klassisk källa till svårfunna buggar.

2) Gör uppdateringar i mongoose konsekventa
- Välj ett mönster för updateOrder:
  - Antingen: findOneAndUpdate(..., { new: true, runValidators: true }) och returnera dokumentet direkt (ingen extra save()).
  - Eller: hämta dokumentet, mutera fält, och await doc.save().
- Undvik att blanda query-uppdatering + save() på samma flöde.

3) Åtgärda async-buggar
- Lägg till await foundOrder.save() i removeOneProductFromOrder (och kontrollera liknande ställen) så att API:t inte svarar innan databasen faktiskt är uppdaterad.

4) Korrigera statuskoder och felhantering
- Returnera 404 när en order/produkt inte hittas (inte 400).
- Lägg gärna in en central error-middleware för mer konsekventa fel (samma format på felrespons).

5) Sortering/sökning: kvalitet och DRY
- Dubbelkolla sorteringslogiken så att "asc" verkligen ger stigande ordning.
- Bryt ut gemensam sorterings-/filterlogik till hjälpfunktioner för att minska duplicerad kod.
- För större datamängder: flytta filtrering/sortering till MongoDB (query + sort) istället för att hämta allt och sortera i minnet.

6) Validering
- Validera nrOfProducts, price (t.ex. > 0), tomma strängar och datatyper. Lägg gärna validering i Mongoose-schema (required/min) och komplettera med controller-validering.

7) Frontend-städning (liten men nyttig)
- Separera rendering av orderItems från formulärfält (inputs fylls just nu inne i en loop, vilket kan ge konstigt beteende).
- Ta bort död kod i innerHTML-byggandet och håll DOM-manipulationen mer konsekvent.

Bra jobbat med helhetsstrukturen (routes/controllers/models) och med att ni faktiskt fått in både sök/sort och en liten klient—det är helt rätt ambitionsnivå. Om ni fixar typ-mismatchen och gör uppdateringsflödena i mongoose robusta så är ni väldigt nära en riktigt stark VG-nivå i praktiken.