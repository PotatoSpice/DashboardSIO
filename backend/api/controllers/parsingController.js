const fs = require('fs').promises;
const xml2js = require('xml2js');

// Processar os numeros que estejam em formato string para numero
// const { parseBooleans, parseNumbers } = require('xml2js').processors;
// Adicionar ao 'parser.parseString(data, <here>, cb)' -> {valueProcessors: [parseNumbers, parseBooleans]}

const Saft = require('../models/Saft');
const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true});

const parseJsonNumbers = function(json) {

	if (Array.isArray(json)) 
	{
		for (let i = 0; i < json.length; i++) 
		{ // iterar sobre os elementos do JSON array

		    let obj = json[i];
		    for (let prop in obj) 
		    { // iterar sobre as propriedades do JSON object

		    	if (typeof obj[prop] === 'object') 
	    		{ // se a propriedade for um objeto, faz recursão
	    			obj[prop] = parseJsonNumbers(obj[prop])
		    	}
		        else if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop]))
		        { // se a propriedade for um numero descrito como string, converte para numero
		            obj[prop] = +obj[prop];
		        }
		        // se nada, manter o campo como está
		    }
		}
	} 
	else {
		let obj = json;
		//console.log('object: ' + obj);

		for (let prop in obj) 
	    { // iterar sobre as propriedades do JSON object

	    	if (typeof obj[prop] === 'object') 
    		{ // se a propriedade for um objeto, faz recursão
    			obj[prop] = parseJsonNumbers(obj[prop])
	    	}
	        else if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop]))
	        { // se a propriedade for um numero descrito como string, converte para numero
	            obj[prop] = +obj[prop];
	        }
	        // se nada, manter o campo como está
	    }
	}
	return json;
}

const parseAndValidateSaft = async function(fileDetails, fileData) {
    // # parse & validation
    // https://github.com/libxmljs/libxmljs
    // https://stackoverflow.com/questions/14856643/validating-xml-against-a-schema-xsd-in-nodejs

    let json = await parser.parseStringPromise(fileData);

    if (json) {
        json = parseJsonNumbers(json);
        // fs.writeFile('C:\\Users\\Asus\\Desktop\\temp.json', JSON.stringify(json))

        const version = json.AuditFile.Header.AuditFileVersion;
        if (!(version === '1.01_01' || version === '1.02_01' || version === '1.03_01' || version === '1.04_01')) 
        { // check SAF-T file version
            throw new Error('Versão do SAF-T desatualizada. Deverá ser enviado um documento com uma das versões disponíveis.');
        }
        else if (false) { // check SAF-T with XSD
            throw new Error('SAF-T não está de acordo com as normas! Ver definição do XSD Schema para a versão do documento.');
        } else {
            return json;
        }
    } else {
        return undefined;
    }
}

const uploadParseSaft = async (req, res, next) => {
    if (!req.file) {
        next({
            message: 'Bad Request. SAF-T não foi recebido!',
            status: 400
        })
    } else {

        // # Ler o ficheiro SAF-T recebido pelo 'multer'
        const xmlSaft = await fs.readFile(req.file.path).catch(next);
        console.log('# READ: received XML SAF-T read successfully!');

        // # Validar SAF-T XML com XSD e Parse para JSON
        const jsonSaft = await parseAndValidateSaft(req.file, xmlSaft).catch(next);

        if (jsonSaft) {
            console.log('# PARSE: XML SAF-T parsed successfully into a JSON!');

            // # Guardar o SAF-T temporario
            const xmlFile = `./saft/SAFTPT_${ jsonSaft.AuditFile.Header.AuditFileVersion }_${ jsonSaft.AuditFile.Header.FiscalYear }_${ Date.now() }.xml`;
            const jsonFile = `./saft/SAFTPT_${ jsonSaft.AuditFile.Header.AuditFileVersion }_${ jsonSaft.AuditFile.Header.FiscalYear }_${ Date.now() }.json`;
            
            await Promise.all([
                fs.writeFile(xmlFile, xmlSaft), 
                fs.writeFile(jsonFile, jsonSaft)]).catch(next);
            console.log('# SAVED: received XML SAF-T successfully saved!');
            console.log('# SAVED: parsed XML SAF-T successfully saved!');

            // # Como não se vai modelar a BD, colocar o JSON na collection 'Saft'
            const saveSaft = {
                Header: jsonSaft.AuditFile.Header,
                MasterFiles: jsonSaft.AuditFile.MasterFiles || undefined,
                GeneralLedgerEntries: jsonSaft.AuditFile.GeneralLedgerEntries || undefined,
                SourceDocuments: jsonSaft.AuditFile.SourceDocuments || undefined
            }
            await Saft(saveSaft).save().catch(next);
            console.log('# DB_SAVE: parsed JSON SAF-T saved to the Database!');

            res.json(jsonSaft);

            await fs.unlink(req.file.path); // remover o ficheiro temporario (opcional)
            console.log('# DELETED: temporary SAF-T successfully removed!');
        }
    }
}

module.exports = {
    uploadParseSaft
}