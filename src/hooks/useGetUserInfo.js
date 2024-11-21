export const useGetUserInfo = () => {
  const { emailValue, userID, isAuth } =
    JSON.parse(localStorage.getItem("auth")) || {};
  return { emailValue, userID, isAuth };
};
