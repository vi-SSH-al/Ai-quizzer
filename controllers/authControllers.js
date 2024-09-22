import jwt from "jsonwebtoken";

// mock login service which accepts any username/ password and genreate a JWT token
// and username as a payload
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: " 400 Bad Request  ||  Username and password are mandotary",
      });
    }

    const payload = {
      username: username,
    };

    // hardcoded 3 hour expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // storing the token in Cookies and as well as sending it in reponse so that
    //In frontend it can be store in Browser localStorage or in Session too.

    // create cookie and send response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      username: { username },
      message: "Logged In",
    });
    // login complete
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error Occured",
      error: error,
    });
  }
};
