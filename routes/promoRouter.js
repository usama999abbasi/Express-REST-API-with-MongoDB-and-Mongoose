const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

const mongoose=require('mongoose');
const Promotions=require('../models/promotions');
var authenticate = require('../authenticate');
const cors = require('./cors');
promoRouter.route('/')
    .get(cors.cors,(req, res, next) => {
        Promotions.find(req.query)
        .then((promo)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promo)
        },(err)=>next(err))
        .catch((err)=>next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promotions.create(req.body)
        .then((promo)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        },err=>next(err))
        .catch((err)=>next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promotions.remove({})
        .then((resp)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },err=>next(err))
        .catch(err=>next(err));
       
    });


promoRouter.route('/:promoId')
    .get(cors.cors,(req, res, next) => {
        Promotions.findById(req.params.promoId)
        .then((promo)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        },err=>next(err))
        .catch((err)=>next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
       Promotions.findOneAndUpdate(req.params.promoId,{
           $set:req.body
       },{
           new:true
       })
       .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },err=>next(err))
    .catch((err)=>next(err));
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((promo)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        },err=>next(err))
        .catch((err)=>next(err));
       
    });

module.exports = promoRouter;
