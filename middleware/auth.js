import jwt from "jsonwebtoken";
// const User = require("../models/User");

//auth
export const auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    // console.log("AFTER ToKEN EXTRACTION");

    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      //   console.log(decode);
      req.user = decode;
    } catch (err) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "Token is Invalid or Expired",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// //isStudent
// exports.isStudent = async (req, res, next) => {
//   try {
//     if (req.user.role !== "Student") {
//       return res.status(401).json({
//         success: false,
//         message: "This is a protected route for Students only",
//       });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "User role cannot be verified, please try again",
//     });
//   }
// };

// // Faculty
// exports.isFaculty = async (req, res, next) => {
//   try {
//     if (req.user.accountType !== "Faculty") {
//       return res.status(401).json({
//         success: false,
//         message: "This is a protected route for Faculty only",
//       });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "User role cannot be verified, please try again",
//     });
//   }
// };

// //isAdmin
// exports.isAdmin = async (req, res, next) => {
//   try {
//     console.log("Printing AccountType ", req.user.accountType);
//     if (req.user.accountType !== "Admin") {
//       return res.status(401).json({
//         success: false,
//         message: "This is a protected route for Admin only",
//       });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "User role cannot be verified, please try again",
//     });
//   }
// };
