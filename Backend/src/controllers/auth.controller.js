const UserModel = require("../models/user.model");
const { sendEmail } = require("../services/mail.service");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // 👇 password validation
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain at least one special character",
        success: false,
      });
    }

    const isUserExist = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return res.status(409).json({
        message: "User already exists with these credentials",
        success: false,
      });
    }

    const user = await UserModel.create({
      email,
      username,
      password,
    });

    // In both register and login
    const omnitoken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // ✅ add this
    );

    try {
      await sendEmail(
        email,
        "Welcome to Omni",
        `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; background-color: #f4f7f9; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 8px; border: 1px solid #e1e1e1;">
                <h1 style="color: #1a1a1a;">Welcome to Omni, ${username}!</h1>
                <p style="color: #555; line-height: 1.5;">We're excited to have you on board. Explore your new dashboard and get started today.</p>
                <div style="margin-top: 30px;">
                    <a href="https://omni-4ih4.onrender.com/api/auth/verify-email?omnitoken=${omnitoken}" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
                </div>
            </div>
        </body>
        </html>
        `,
      );
    } catch (mailError) {
      console.error("Email failed to send, but user was created:", mailError);
    }

    user.password = undefined;

    res.cookie("omnitoken", omnitoken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  const { identity, password } = req.body;

  const normalizedIdentity = identity.toLowerCase();

  const user = await UserModel.findOne({
    $or: [{ email: normalizedIdentity }, { username: normalizedIdentity }],
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  const isRightPass = await user.comparepassward(password);

  if (!isRightPass) {
    return res.status(400).json({
      message: "Password is invalid",
      success: false,
    });
  }
  // In both register and login
  const omnitoken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, // ✅ add this
  );

  res.cookie("omnitoken", omnitoken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  user.password = undefined;
  res.status(200).json({
    message: "User login successfully",
    success: true,
    user,
  });
};

const verify_Email = async (req, res) => {
  const { omnitoken } = req.query;

  const decode = jwt.verify(omnitoken, process.env.JWT_SECRET);

  const user = await UserModel.findOne({ email: decode.email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      error: "User not found",
    });
  }

  user.verified = true;
  await user.save();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified | Omni</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f7f9;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .card {
            background: white;
            padding: 50px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            text-align: center;
            max-width: 400px;
            width: 90%;
            animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .icon-circle {
            width: 80px;
            height: 80px;
            background-color: #d4edda;
            color: #28a745;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 24px;
            font-size: 40px;
        }
        h1 {
            color: #1a1a1a;
            margin-bottom: 16px;
            font-size: 24px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        .btn {
            background-color: #007bff;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            transition: background 0.3s ease;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-circle">✓</div>
        <h1>Email Verified!</h1>
        <p>Thank you, <strong>${user.username}</strong>. Your email has been successfully verified. You now have full access to your Omni account.</p>
        <a href="https://omni-five-topaz.vercel.app/notes" class="btn">Go to Dashboard</a>
    </div>
</body>
</html>
`;

  res.send(html);
};

const get_me = async (req, res) => {
  try {                             
    const omnitoken = req.cookies.omnitoken;

    if (!omnitoken) {
      return res.status(401).json({
        message: "User is Unauthorized",
      });
    }

    let decoded = null;

    try {
      decoded = jwt.verify(omnitoken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "user not authorized",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "user fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("omnitoken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { register, login, verify_Email, get_me,logout };
