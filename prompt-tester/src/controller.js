const modelService = require('./modelService');

async function comparePrompt(req, res) {
    let params = {
        prompt1 : req.body.prompt1,
        prompt2 : req.body.prompt2,
        question : req.body.question,
        model : req.body.model
    }
    try {
        const [response1, response2] = await Promise.all([modelService.callModel(params.prompt1, params.question, params.model), modelService.callModel(params.prompt2, params.question, params.model)]);
        console.log(response1, response2);

        res.json({  
            response1 : response1,
            response2: response2
        });
        
    } catch (error) {
        console.log("Error in Compare Prompt", error.message);
        res.status(500).json({ error: error.message });
    }

}

async function testPrompt(req, res) {
    //let resArray = [];
    let params = {
        prompt : req.body.prompt,
        questions : req.body.questions,
        model : req.body.model
    }
    try{
        /* for(let question of params.questions){
            let response = await modelService.callModel(params.prompt,question, params.model);
            resArray.push(response);
        }
        res.json(resArray); */
        const promises = params.questions.map(question => modelService.callModel(params.prompt, question, params.model));
        const results = await Promise.all(promises);
        res.json(results);

    }catch(error){
        console.log("Error in Test Prompt", error.message);
        res.status(500).json({error: error.message});
    }
}


module.exports = {comparePrompt, testPrompt};