 //backend/routes/index.js
 
 const express = require('express');
 const path = require('path');
 const router = express.Router();
 const apiRouter = require('./api');
 
 router.use('/api', apiRouter);
 
 if (process.env.NODE_ENV === 'production') {
   router.get('/', (req, res) => {
     res.cookie('XSRF-TOKEN', req.csrfToken());
     res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
   });
 
   router.use(express.static(path.resolve(__dirname, '../../frontend/dist')));
 
   router.get(/^(?!\/?api).*/, (req, res) => {
     res.cookie('XSRF-TOKEN', req.csrfToken());
     res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
   });
 }
 
 module.exports = router;