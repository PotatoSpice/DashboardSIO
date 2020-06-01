const fs = require('fs').promises;

const Saft = require('../models/Saft');

const parseAndValidateSaft = async function(fileDetails, fileData) {
    var jsonSaft = {};
    // # simple parse
    // https://github.com/Leonidas-from-XIV/node-xml2js
    // # parse & validation
    // https://github.com/libxmljs/libxmljs
    // https://stackoverflow.com/questions/14856643/validating-xml-against-a-schema-xsd-in-nodejs

    var dummy = false;
    if (dummy) { // check SAF-T file version
        throw new Error('Versão do SAF-T desatualizada. Deverá ser enviado um documento com a última versão disponível.')
    }
    else if (dummy) { // check SAF-T with XSD
        throw new Error('SAF-T não está de acordo com as normas! Ver definição do XSD Schema para a versão do documento.')
    } else {
        return jsonSaft;
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
        const tempXmlSaft = await fs.readFile(req.file.path).catch(next);

        // # Validar SAF-T XML com XSD e Parse para JSON
        const jsonSaft = await parseAndValidateSaft(req.file, tempXmlSaft).catch(next);

        // # Guardar o SAF-T temporario
        const xmlFile = `./saft/${ Date.now() }_SAFT_${ jsonSaft.Header.AuditFileVersion }_${ jsonSaft.Header.FiscalYear }.xml`,
                jsonFile = `./saft/${ Date.now() }_SAFT_${ jsonSaft.Header.AuditFileVersion }_${ jsonSaft.Header.FiscalYear }.json`;
        
        await Promise.all([
            fs.writeFile(xmlFile, tempXmlSaft), 
            fs.writeFile(jsonFile, jsonSaft)]).catch(next);
        // await fs.unlink(req.file.path); // remover o ficheiro temporario (opcional)

        // # Como não se vai modelar a BD, colocar o JSON na collection 'Saft'
        await Saft(jsonSaft).save().catch(next);

        res.download(jsonFile, 'Parsed_SAF-T.json');
    }
}

module.exports = {
    uploadParseSaft
}