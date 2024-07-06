const express = require("express");
const {body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/Fetchuser");
const Note = require("../models/Note"); 
const router = express.Router();

//Route 1 : To add the notes
router.post('/addnotes', [ 
body('title', "A title should be of lengthn 3").isLength({ min: 3 }),
body('description', 'Description should be of length 5(minimum)').isLength({ min: 5 })
],
fetchuser,async (req,res)=>{
    
    const errors = validationResult(req) ;
    if(!errors.isEmpty()){
        return res.status(401).json(errors.array())
    }

    try {

        const note = await Note.create({
            user : req.user.id,
            title : req.body.title,
            description : req.body.description,
            tag : req.body.tag,
        })
    
        res.send(note)
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }
    
    
})


//Route 2: To fetch the all notes

router.post('/fetchnotes', fetchuser, async (req, res) => {

    try {
        const note = await Note.find({user : req.user.id}); 
        res.json(note)
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }
})


//Route 3: Updating the notes

router.put('/update/:id', fetchuser,async (req,res)=>{

    const newNote = {
        title: req.body.title,
        description : req.body.description,
        tag : req.body.tag,
    }
    
    let note = await Note.findById(req.params.id)

    if(!note) return res.status(400).send({error: "Notes in not found"})
    if(note.user.toString() !== req.user.id) return res.status(400).send({error: "User mismatched"})
    
        note = await Note.findByIdAndUpdate(note, {$set : newNote}, {new : true})
        res.send(note);

    })

//Route 4: To delete a note

router.delete('/deletenote/:id', fetchuser,async (req,res)=>{
    
try {
    let note = await Note.findById(req.params.id)

    if(!note) return res.status(400).send({error: "Notes in not found"})
    if(note.user.toString() !== req.user.id) return res.status(400).send({error: "User mismatched"})
    
        note = await Note.findByIdAndDelete(req.params.id)
        res.send({Success: "Note deleted", note});

    }catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }

})
 

module.exports = router