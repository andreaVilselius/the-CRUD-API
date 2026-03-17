Instruktioner:

öppna upp en ny terminal: 
I terminal:
cd Backend 
npm i express
npm run dev 
Öppna upp en till terminal: 
I terminal: 
cd Frontend
npm install
npm run dev 
-----
hemsida: https://the-crud-api-frontend.onrender.com/


--------------
Denna inlämning går igenom följande mål från kursplanen:

Kommunikation med olika API:er (REST API:er vs GraphQL) med cors
Planering och skapande av dynamiska webb-API:er
Olika databaser så som NoSQL och SQL samt databasdesign och normalisering av databaser
 
Tillämpa databasdrivna API:er
Optimera och anpassa databaser utifrån given kravspecifikation
---
Mitt betyg: VG 
----- 
instruktioner: 

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
