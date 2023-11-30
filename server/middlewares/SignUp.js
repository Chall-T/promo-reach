import User from "../models/User.js";
import { getRoles, getRoleByName } from "../models/Role.js";

export const checkDuplicateEmail = (req, res, next) => {

    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (user) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }

        next();
    });
};
export const test = async() => {
    console.log(await getRoles());
}
export const checkRolesExisted = async(req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!await getRoleByName(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
      }
    }
  }
  next();
};
