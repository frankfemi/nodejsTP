var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Conference
var ConferenceSchema = mongoose.Schema({
    nom: String,
    date_debut: String,
    heure_debut: String,
    heure_fin: String,
    lieu: String,
  });
  
  module.exports = mongoose.model('Conference', ConferenceSchema);