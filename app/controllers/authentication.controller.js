async function login (req,res) {

}

async function register (req,res) {
    console.log(req.body);
    const user = req.body.user;
    const pass = req.body.contra;
    const vpass = req.body.vcontra;
    const email = req.body.email;
    if(!user || !pass || !vpass || !email){
        res.status(400).send({status:"Error",message:"Los campos están incompletos"});
    }
}

export const methods = {
    login,
    register
}