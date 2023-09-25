const mongoose = require("mongoose");

const ImageDetailsSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true,
      },
      originalname: {
        type: String,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
});
const ImageModel = mongoose.model ("ImageDetails", ImageDetailsSchema);
module.exports = ImageModel;