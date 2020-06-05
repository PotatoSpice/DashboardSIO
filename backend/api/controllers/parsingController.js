const fsp = require('fs').promises;
const fs = require('fs');
const xml2js = require('xml2js');
const schemaValidator = require('xsd-schema-validator')

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

const deleteTempFile = function(file_path) {
    // # Remover o ficheiro temporario (opcional)
    console.log('# DELETE: deleting temporary Multer upload file ...');
    fs.unlink(file_path, function(err) {
        if (!err) console.log('- deleted temporary file -');
        else console.log('- something went wrong -');
    })
}

const uploadParseSaft = function (req, res, next) {
    if (!req.file) {
        next({
            message: 'Bad Request. SAF-T não foi recebido!',
            status: 400
        })

    } else {
        const file_path = req.file.path;

        // # Ler o ficheiro SAF-T recebido pelo 'multer'
        console.log('# READ: reading received XML SAF-T ...');
        fs.readFile(file_path, function(err, xmlSaft) { // CB
            if (err) {
                next({ message: err.message, status: err.status })
                deleteTempFile(file_path)
                return;
            }
            console.log('- success -');
            
            // # Validar SAF-T XML com XSD
            console.log('# CHECK: validating XML SAF-T with related XSD Schema ...');
            schemaValidator.validateXML({file: file_path}, `saft_validation/SAFTPT1.04_01.xsd`, function(err, result) { // CB
                if (err) {
                    next({ message: err.message, status: err.status })
                    deleteTempFile(file_path)
                    return;

                } else if (result.valid) {
                    console.log('- success -');

                    // # Parse do XML para JSON
                    console.log('# CHECK: parsing XML SAF-T parsed into JSON ...');
                    parser.parseString(xmlSaft, function(err, jsonSaft) { // CB
                        if (err) {
                            next({ message: err.message, status: err.status })
                            deleteTempFile(file_path)
                            return;
                        }
                        console.log('- success -');

                        // transformar strings de números em números
                        console.log('# CHECK: parsing Numbers in String into Number type ...');
                        jsonSaft = parseJsonNumbers(jsonSaft);
                        console.log('- success -');

                        // # Colocar o JSON na collection 'Saft'
                        const saveSaft = {
                            Header: jsonSaft.AuditFile.Header,
                            MasterFiles: jsonSaft.AuditFile.MasterFiles || undefined,
                            GeneralLedgerEntries: jsonSaft.AuditFile.GeneralLedgerEntries || undefined,
                            SourceDocuments: jsonSaft.AuditFile.SourceDocuments || undefined
                        }
                        console.log('# DB_SAVE: saving parsed JSON SAF-T to the Database ...');
                        Saft(saveSaft).save( function(err) {
                            if (err) {
                                next({ message: err.message, status: err.status })
                                deleteTempFile(file_path)
                                return;
                            }
                            console.log('- success -');

                            // # Envio da resposta para o Client
                            res.json(jsonSaft);

                            deleteTempFile(file_path)
                        })
                    })
                } else {
                    next({ 
                        message: 'SAF-T invalidado pelo Schema! Deverá ser enviado um documento com a última versão do SAFTPT disponivel.', 
                        status: 404 
                    })
                }
            })
        })
    }
}

module.exports = {
    uploadParseSaft
}

// ## DEPRECATED
// # Versão em Promises do upload do ficheiro. Não se realiza a validação do XML pelo XSD Schema!
const uploadParseSaftPromise = async (req, res, next) => {
    if (!req.file) {
        next({
            message: 'Bad Request. SAF-T não foi recebido!',
            status: 400
        })
        
    } else {
        // # Ler o ficheiro SAF-T recebido pelo 'multer'
        console.log('# READ: reading received XML SAF-T ...');
        const xmlSaft = await fsp.readFile(req.file.path).catch(next);
        console.log('- success -');

        // # Validar SAF-T XML com XSD e Parse para JSON
        console.log('# CHECK: parsing XML SAF-T parsed into JSON ...');
        const json = await parser.parseStringPromise(xmlSaft).catch(next);

        if (json) {
            console.log('- success -');

            // transformar strings de números em números
            console.log('# CHECK: parsing Numbers in String into Number type ...');
            const jsonSaft = parseJsonNumbers(json);
            console.log('- success -');

            const version = json.AuditFile.Header.AuditFileVersion;
            if (!(version === '1.01_01' || version === '1.02_01' || version === '1.03_01' || version === '1.04_01')) 
            { // check SAF-T file version
                next({
                    message: 'Versão do SAF-T desatualizada. Deverá ser enviado um documento com uma das versões disponíveis.',
                    status: 404
                })
            }

            // // # Guardar o XML recebido e o JSON transformado (opcional)
            // const xmlFile = `./saft/SAFTPT_${ jsonSaft.AuditFile.Header.AuditFileVersion }_${ jsonSaft.AuditFile.Header.FiscalYear }_${ Date.now() }.xml`;
            // const jsonFile = `./saft/SAFTPT_${ jsonSaft.AuditFile.Header.AuditFileVersion }_${ jsonSaft.AuditFile.Header.FiscalYear }_${ Date.now() }.json`;
            // await Promise.all([
            //     fsp.writeFile(xmlFile, xmlSaft), 
            //     fsp.writeFile(jsonFile, jsonSaft)]).catch(next);
            // console.log('# SAVED: received XML SAF-T successfully saved!');
            // console.log('# SAVED: parsed XML SAF-T successfully saved!');

            // # Como não se vai modelar a BD, colocar o JSON na collection 'Saft'
            const saveSaft = {
                Header: jsonSaft.AuditFile.Header,
                MasterFiles: jsonSaft.AuditFile.MasterFiles || undefined,
                GeneralLedgerEntries: jsonSaft.AuditFile.GeneralLedgerEntries || undefined,
                SourceDocuments: jsonSaft.AuditFile.SourceDocuments || undefined
            }
            console.log('# DB_SAVE: saving parsed JSON SAF-T to the Database ...');
            await Saft(saveSaft).save().catch(next);
            console.log('- success -');
            
            // # Envio da resposta para o Client
            res.json(jsonSaft);

            // # Remover o ficheiro temporario (opcional)
            console.log('# DELETE: deleting temporary SAF-T ...');
            await fsp.unlink(req.file.path);
            console.log('- success -');
        }
    }
}