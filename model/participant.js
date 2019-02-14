const mongoose = require('mongoose'), Schema = mongoose.Schema;

//Participant
 
var ParticipantSchema = mongoose.Schema({
    nom: String,
	  conferences : [{ type: Schema.Types.ObjectId, ref: 'Conference' }]
});
 
module.exports = mongoose.model('Participant', ParticipantSchema);