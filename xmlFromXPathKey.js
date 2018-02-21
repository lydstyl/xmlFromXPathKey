/* 
Ce script permet de créer un squelette xml à partir d'un xPath key.
Il est utile en combinaison avec xmlCreator
Todo : faire en sorte que le script fonctionne aussi s'il y a plus de 1 attribu dans un tag
*/

if (process.argv[2] == undefined) {
    throw 'Il manque la key en argument! Exemple d\'utilisation correcte : \nnode xmlFromXPathKey.js //catalog/category[attribute::category-id="corps"]/display-name[attribute::xml:lang="de-DE"]';
}
if (process.argv[2] != undefined) { 
    xPath = process.argv[2];
}

let xml = '';
xPath = xPath.split('/');
let tab = 0;

function nTab(n) {
    let str = '';
    for (let i = 0; i < n; i++) {
        str += '\t';
    }
    return str;
}

for (let i = 0; i < xPath.length; i++) {
    const tag = xPath[i];
    if (i < 2) {
        continue;
    }
    if (i == 2 && tag == 'catalog') {
        xml += 
`<?xml version="1.0" encoding="UTF-8"?>
<catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="storefront-de-babyliss">
\tMIDDLE`;
    }else{ // we are after first tag
        tab += 1;
        console.log(`tag: ${tag}`);
        if (tag.indexOf('[') < 0) { // there is no attribute
            let middle = `
${nTab(tab)}<${tag}>
${nTab(tab +1)}MIDDLE
${nTab(tab)}</${tag}>
`;
            xml = xml.replace(/MIDDLE/i, middle);
        }
        else{ // there is an attribute
            let tagLeft, attr, attrVal;
            tagLeft = tag.split('[')[0];
            let str = tag.split('[')[1]; // attribute::category-id="*"]
            let re = /attribute::([^§]*)]$/i;
            let trouvé = str.match(re);
            attr = trouvé[1];
            let middle = `
${nTab(tab)}<${tagLeft} ${attr}>
${nTab(tab + 1)}MIDDLE
${nTab(tab)}</${tagLeft}>
`;
            xml = xml.replace(/MIDDLE/i, middle);
        }
    }
}
xml += '</catalog>';
xml = xml.replace('MIDDLE', '');

console.log('\nxml :\n');
console.log(xml);