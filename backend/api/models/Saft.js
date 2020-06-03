var mongoose = require('mongoose');

var SaftSchema = new mongoose.Schema({
    Header: { type: Object, required: true },
    MasterFiles: { type: Object },
    GeneralLedgerEntries: { type: Object },
    SourceDocuments: { type: Object }
});

module.exports = mongoose.model('Saft', SaftSchema, 'saft');