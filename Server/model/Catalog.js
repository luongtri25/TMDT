const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        required: true,
    },
    nameCatalog: {
        type: String,
        required: true
    },
    img: { type: String }
}, {
});

module.exports = mongoose.model('Catalogs', CatalogSchema);
