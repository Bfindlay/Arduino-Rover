'use strict';

let router = require('express').Router();

router.get('/',function(req,res){
    console.log("accessed api");
    
  res.writeHead(200);
    res.end("< c a b >");
});

module.exports = router;

