const UserModel = require("../models/user.model");
const { sendEmail } = require("../services/mail.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

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

    // hash password before putting in token
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 temp token — no DB yet
    const token = jwt.sign(
      { email, username, password: hashedPassword },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }, // expires in 15 minutes
    );

    await sendEmail(
      email,
      "Verify your Omni account",
      `
      <!DOCTYPE html>
      <html>
      <body style="font-family: sans-serif; background-color: #f4f7f9; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 8px; border: 1px solid #e1e1e1;">
              <h1 style="color: #1a1a1a;">Verify your email, ${username}!</h1>
              <p style="color: #555; line-height: 1.5;">Click the button below to complete your registration. This link expires in 15 minutes.</p>
              <div style="margin-top: 30px;">
                  <a href="https://omni-4ih4.onrender.com/api/auth/verify-email?token=${token}" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
              </div>
          </div>
      </body>
      </html>
      `,
    );

    res.status(200).json({
      message: "Verification email sent. Please check your inbox.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const verify_Email = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, username, password } = decoded;

    const isUserExist = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      // 👇 already verified, just send them to login instead of erroring
      return res.send(html);
    }

    const user = await UserModel.create({ email, username, password });

    // 👇 no cookie here — it won't work cross domain
    // just show the success page and let them login manually
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified | Omni</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
            font-family: 'Segoe UI', sans-serif;
        }

        .card {
            background: #eaeaeb;
            border: 1px solid gray;
            padding: 56px 48px;
            border-radius: 16px;
            text-align: center;
            max-width: 420px;
            width: 90%;
            box-shadow: 0px 0px 10px black;
            animation: rise 0.5s ease-out;
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .check-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgb(56, 56, 56);
            border: 1px solid gray;
            box-shadow: inset 0px 0px 15px black;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 28px;
        }

        .check-circle svg {
            width: 36px;
            height: 36px;
            stroke: #22c55e;
            stroke-width: 2.5;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: draw 0.5s ease-out 0.4s forwards;
        }

        @keyframes draw {
            to { stroke-dashoffset: 0; }
        }

        h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        p {
            color: #888;
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 36px;
        }

        p span {
            color: #22c55e;
            font-weight: 600;
        }

        .btn {
            display: inline-block;
            background-color: rgb(56, 56, 56);
            backdrop-filter: blur(5rem);
            padding: 0.7rem 2rem;
            box-shadow: inset 0px 0px 15px black;
            border: 1px solid gray;
            border-radius: 0.5rem;
            font-weight: 650;
            color: white;
            text-decoration: none;
            font-size: 15px;
            cursor: pointer;
            transition: all ease 0.3s;
        }

        .btn:hover {
            background-color: rgb(75, 75, 75);
            box-shadow: inset 0px 0px 20px black;
            border-color: #aaa;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="check-circle">
            <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        </div>
        <h1>Email Verified!</h1>
        <p>Your email has been successfully verified.<br/>You can now <span>log in</span> to your Omni account.</p>
        <a href="https://omni-five-topaz.vercel.app/login" class="btn">Go to Login</a>
    </div>
</body>
</html>
`;

    res.send(html);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;background:#0f0f0f;color:#fff;text-align:center;">
          <div>
            <h2 style="color:#ef4444;">Link Expired</h2>
            <p style="color:#888;margin-top:12px;">Your verification link has expired. Please register again.</p>
            <a href="https://omni-five-topaz.vercel.app/register" style="display:inline-block;margin-top:24px;background:#ef4444;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Register Again</a>
          </div>
        </body>
        </html>
      `);
    }
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
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

module.exports = { register, login, verify_Email, get_me, logout };
