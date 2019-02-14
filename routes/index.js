var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { page:'Home',menuId:'home' });
});

/* GET chat. */
router.get('/chat', function(req, res, next) {
  res.render('chat', { page:'CHAT',menuId:'home' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { page:'Login',menuId:'login' });
});


/* POST pour login */
router.post('/login', function(req, res) {

  // On positionne la variable db sur la base de données
  var db = req.db;

  // On récupère les données du formulaire
  var userLogin = req.body.login;
  // On récupère la collection
  var collection = db.get('User');
  //Vérification de l'utilisateur
  collection.find({username : userLogin}, function (err, docs) {
    console.log(docs.length);
    if (docs.length){
         // En cas de succès on revient sur la page /userlist
         res.render('index', {
          page: 'ENIGMA-CONF',
          menuId:'home',
          "name" : docs.name
      });
    }else{
      // En cas de problème, on renvoie une erreur
      res.send(500,'Identifiant ou mot de passe incorrect');
    }
});
});

/* GET Conflist page. */
router.get('/conflist', function(req, res) {
  var db = req.db;
  var collection = db.get('Conference');
  collection.find({},{},function(e,docs){
      res.render('conflist', {
          page: 'Liste des conférences',
          menuId:'conf',
          "conflist" : docs,
          moment: moment
      });
  });
});

/* GET page pour une Nouvelle conférence */
router.get('/newconf', function(req, res) {
  res.render('newconf', { 
    page: 'Ajouter une nouvelle conférence' ,
    menuId:'conf'
  });
});

/* POST pour ajouter une nouvelle conf */
router.post('/addconf', function(req, res) {

    // On positionne la variable db sur la base de données
    var db = req.db;

    // On récupère les données du formulaire
    var nomConf = req.body.nomConf;
    var dateDeb = req.body.dateDeb;
    var heureDeb = req.body.heureDeb;
    var heureFin = req.body.heureFin;
    var lieu = req.body.lieu;

    // On récupère la collection
    var collection = db.get('Conference');

	// On insère les données dans la base
    collection.insert({
        "nom" : nomConf,
        "date_debut" : dateDeb,
        "heure_debut" : heureDeb,
        "heure_fin" : heureFin,
        "lieu" : lieu,
    }, function (err, doc) {
        if (err) {
            // En cas de problème, on renvoie une erreur
            res.send("Il y a un problème pour insérer les données dans la base.");
        }
        else {
            // En cas de succès on revient sur la page /conflist
            res.location("conflist");
            res.redirect("conflist");
        }
    });
});



/* GET page pour modifier une conférence. */
router.get('/editconf/:id', function(req, res) {
  var id = req.params.id;
  var o_id = new ObjectId(id);
  var db = req.db;
  var collection = db.get('Conference');
  collection.findOne({_id : o_id }, function(err, docs){
    res.render('editconf', {
      page: 'Modifier Conférence',
      menuId:'conf',
      confdetail : docs
  });
  });
  });

/* POST pour modifier une conférence */
router.post('/editconf/:id', function(req, res) {
  var id = req.params.id;
  var db = req.db;
  console.log(id);
   db.collection('Conférence').update ({ _id: ObjectId(id) }, {$set: {
    nom: req.body.nomConf,
    date_debut: req.body.dateDeb,
    heure_debut: req.body.heureDeb,
    heure_fin: req.body.heureFin,
    lieu: req.body.lieu,
 }
}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
     res.redirect("../conflist");
}
});
});


/* GET page pour supprimer une conférence. */
router.get('/deleteconf/:id', function(req, res) {
  var id = req.params.id;
  var db = req.db;
  db.collection("Conference").remove({_id : ObjectId(id)}, function(err, obj) {
    if (err) throw err;
    res.redirect("../conflist");
    db.close();
  });
  });



  /* GET page pour une inscription */
router.get('/inscription/:id', function(req, res) {
  var id = req.params.id;
  var o_id = new ObjectId(id);
  var db = req.db;
  var collection = db.get('Conference');
  collection.findOne({_id : o_id }, function(err, docs){
    res.render('inscription', {
      page: 'Inscription',
      menuId:'conf',
      confdetail : docs,
      moment: moment
  });
  });
});

/* POST pour ajouter un participant à une conférence */
router.post('/inscription/:id', function(req, res) {

    // On positionne la variable db sur la base de données
    var db = req.db;
    var id = req.params.id;
    var o_id = new ObjectId(id);
   
    // On récupère les données du formulaire
    var nomConf;
    var dateDeb;
    var heureDeb ;
    var heureFin ;
    var lieu ;
    var login = req.body.login;
    var password = req.body.password;

    var collection_ = db.get('Conference');
    collection_.findOne({_id : o_id }, function(err, docs){
      nomConf = docs.nom;
      dateDeb = docs.date_debut;
      heureDeb = docs.heure_debut;
      heureFin = docs.heure_fin;
      lieu = docs.lieu;
      console.log(nomConf);

      // On récupère la collection
    var collection = db.get('User');

    // On insère les données dans la base
      collection.insert({
          "login" : login,
          "password" : password,
          "nom" : nomConf,
          "date_debut" : dateDeb,
          "heure_debut" : heureDeb,
          "heure_fin" : heureFin,
          "lieu" : lieu,
      }, function (err, doc) {
          if (err) {
              // En cas de problème, on renvoie une erreur
              res.send("Il y a un problème pour insérer les données dans la base.");
          }
          else {
              // En cas de succès on revient sur la page /conflist
              res.render('index', {
                page: 'ENIGMA-CONF',
                menuId:'home'
              });
          }
      });
  });
});





/* GET simuler la deconnexion. */
router.get('/logout', function(req, res, next) {
  res.render('index', { page:'Home',menuId:'home' });
});

module.exports = router;
