import { ROOT_URL } from "../data/func";

export const loginFunc = async (username: string, password: string) => {
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

const urlencoded = new URLSearchParams();
urlencoded.append("username", "admin");
urlencoded.append("password", "admin");

const requestOptions:any = {
  method: "POST",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow"
};

fetch("http://localhost/workspace-backend/login/action.php?api=27bbd436214045afb1daf1bbc1d7b134&action=login", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  };
  