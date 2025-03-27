export const useGetUserInfo = () => {
  const { emailValue, userID, isAuth } =
    JSON.parse(sessionStorage.getItem('auth')) ||
    JSON.parse(localStorage.getItem('auth')) ||
    {};
  return { emailValue, userID, isAuth };
};
