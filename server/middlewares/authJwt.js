import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { Role } from '../models/Role.js';

export const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.cookies['accessToken'];


    if (!token) {
    return res.status(403).json({ message: "No token provided!" });
    }
    jwt.verify(token,
        process.env.SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized!",
                });
            }
        req.userId = decoded.id;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
    if (err) {
        return res.status(500).json({ message: err });
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
            return res.status(500).json({ message: err });
        }

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                next();
            }
        }

        return res.status(403).json({ message: "Require Admin Role!" });
      }
    );
  });
};

export const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        return res.status(403).json({ message: "Require Moderator Role!" });
      }
    );
  });
};