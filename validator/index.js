exports.validator = (req, res, next) => {
    var rest;
    req.check('fullname', "Enter Full Name").notEmpty();
    req.check('password', "Please enter a password in between 6 to 20 digits & uppercase, lowercase, digits & special characters").isLength({
        min : 6,
        max : 20
    })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i");

    const error = req.validationErrors();

    if(error) {
        const firstError = error.map(error => error.msg)[0];
        return req.session.flag = 6, res.redirect('/')
        //res.status(400).json({ error: firstError});
    }
    next();
}