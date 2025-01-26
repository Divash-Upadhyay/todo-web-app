import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";

function App() {
  const isLoggedIn = useSelector((state: any) => state.auth);
  console.log("isloff",isLoggedIn);
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {isLoggedIn ? <Route path="/todo" element={<TodoPage />} /> : null}
      </Routes>
    </>
  );
}

export default App;
