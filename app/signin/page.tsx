import { Suspense } from "react";
import Login from "@/components/signin";

const LoginPage: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  );
};

export default LoginPage;
