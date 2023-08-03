const express = require("express");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");

const routes = require("./routes");
async function launchServer() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // app.use(cookieParser);
  app.use(
    session({
      secret: "your_secret_key", // 세션을 암호화하는데 사용되는 임의의 문자열 (반드시 바꿔주세요)
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false, // true로 설정하면 HTTPS에서만 사용 가능 (배포 환경에서는 true로 설정해야합니다)
        httpOnly: true, // JavaScript에서 쿠키를 조회할 수 없도록 설정
        maxAge: 1000 * 60 * 60 * 24, // 쿠키의 만료 시간 (예: 1일)
      },
    })
  );

  // app.use(express.static("downloaded"));
  app.use(bodyParser.json());
  app.use(routes);
  // app.get("/", (req, res) => {
  //   res.json({ message: "hello" });
  // });
  const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`서버가 실행 중입니다. URL: http://${host}:${port}`);
  });
}

launchServer();
