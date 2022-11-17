const User = require("./../Model/userSchema");

exports.getAllUsers = (req, res, next) => {
    User.find({})
        .then(data => {
            res.status(200).json(data)
        }).catch(err => next(err))
}

exports.addUser = (req, res, next) => {
    // console.log("req", req.body)
    const body = req.body;
    if (body.firstname && body.lastname && body.email && body.age) {
        let newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            age: req.body.age
        });
        User.findOne({ email: req.body.email })
            .then(data => {
                if (data) {
                    res.status(422).json({ error: "Duplicate Email! emails should be unique" })

                } else {
                    newUser.save()
                        .then(data => {
                            console.log(data)
                            res.status(201).json(data)
                        }).catch(err => next(err))
                }
            })

    } else {
        let err = new Error();
        err.status = 422;
        err.message = "your data is not complete"
        throw err;
    }

}

exports.updateUser = (req, res, next) => {
    console.log("update catch")
    console.log("body", req.body)
    User.updateOne({ _id: req.body.id }, {
        $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            age: req.body.age
        }

    }).then(data => {
        res.status(200).json({ data: "updated", body: data })

    }).catch(err => next(err))
}

exports.deleteUser = (req, res, next) => {
    User.deleteOne({ email: req.body.email })
        .then(data => {
            if (data == null) throw new Error("we have no speaker with this email");
            res.status(200).json({ msg: "deleted", data })
        }).catch(err => console.log(err))
}