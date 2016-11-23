var express = require('express');
var bodyParser = require('body-parser');
var accounts = require('./accounts.json');
var app = express();

app.use(bodyParser.json());


app.get('/api/accounts', function(req, res, next){
  var result;
  var query = req.query;
  if(query.cardtype){
    console.log('step in');
    result = accounts.filter(function(e){
      return e.card_type.toLowerCase() === query.cardtype.toLowerCase();
    });
    res.json(result);
} else if (query.firstname){
  result = accounts.filter(function(e){
    return e.first_name.toLowerCase() === query.firstname.toLowerCase();
  });
  res.json(result);
} else if (query.lastname){
  result = accounts.filter(function(e){
    return e.last_name.toLowerCase() === query.lastname.toLowerCase();
  });
  res.json(result);
} else if (query.balance){
  result = accounts.filter(function(e){
    return Number(e.balance) === Number(query.balance);
  });
  res.json(result);
}
  else{
  console.log('getting accounts');
  res.json(accounts);
}
});

app.get('/api/accounts/:id', function(req, res, next){
  var id = req.params.id, flag;
    accounts.map(function(e, i){
      if(e.id === Number(id)){
        res.json(e);
        flag = true;
      }
    });
    if(!flag) res.sendStatus(404, 'account could not be found');
});

app.post('/api/accounts', function(req, res, next){
  console.log('stepping to post');
  var newId = accounts.length;
  var appStates = [req.body.approved_states];
  var newAccount = {
    id : newId,
    card_number: req.body.card_number,
    card_type: req.body.card_type,
    balance: req.body.balance,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    approved_states: appStates
  };
  accounts.push(newAccount);
  res.json(newAccount);
});

app.post('/api/accounts/cardtype/:accountId', function(req, res, next){
  var newCard = req.body.card_type;
  var id = Number(req.params.accountId);
  accounts.map(function(e, i){
    if(e.id === id){
      e.card_type = newCard;
      res.json(e);
    }
  });
});

app.post('/api/accounts/approvedstates/:accountId', function(req, res, next){
  var id = Number(req.params.accountId);
  var newState = req.body.add;
  accounts.map(function(e, i){
    if(e.id === id){
      e.approved_states.push(newState);
      res.sendStatus(200);
    }
  });
});

app.delete('/api/accounts/approvedstates/:id/', function(req, res, next){
  var deleteMe = req.query.statename;
  var id = Number(req.params.id);
  accounts.map(function(e, i){
    if(e.id === id){
      e.approved_states.splice(e.approved_states.indexOf(deleteMe), 1);
      res.json(e.approved_states);
    }
  });
});

app.delete('/api/accounts/:id', function(req, res, next){
  var id = Number(req.params.id);
    accounts.map(function(e, i){
      if(e.id === id){
        accounts.splice(i, 1);
        res.json(200);
      }
    });
});

app.put('/api/accounts/:id', function(req, res, next){
  var id = Number(req.params.id);
  accounts.map(function(e, i){
    if(e.id === id){
      for(var key in req.body){
        e[key] = req.body[key];
      }
      res.json(e);
    }
  });
});



app.listen(3000, function(){
  console.log('Listening on port 3000');
});


module.exports = app;
